import fetch from 'isomorphic-fetch';
import jsyaml from 'js-yaml';

export function toggle(path) {
  return (dispatch, getState) => {
    console.log("toggle", path);
    let newPath = path.split('/');
    if(newPath[newPath.length-1].substr(0, 1) === '_')
      newPath[newPath.length-1] = newPath[newPath.length-1].substr(1);
    else
      newPath[newPath.length-1] = '_'+newPath[newPath.length-1];

    newPath = newPath.join('/');
    dispatch({ type: 'ADD_DIFF', diff: { [path]: {type: "rename", to: newPath} } });
    let {node, name} = getNode(getState().tree.tree, path, true);
    node[name].file.path = newPath;
    node[newPath.split('/').pop()] = node[name];
    delete node[name];
  };
}

export function remove(path) {
  return (dispatch, getState) => {
    dispatch({ type: 'ADD_DIFF', diff: { [path]: {type: "delete"} } });
    let {node, name} = getNode(getState().tree.tree, path, true);
    delete node[name];
    let d = getState().documents.documents;
    for(let [index, value] of d.entries())
      if(value.file.path === path)
        d.splice(index, 1);
  };
}

export function save(path, data) {
  return (dispatch, getState) => {
    let status = "-";
    let newPath = data['file.path'];
    delete data['file.path'];

    for(let i in data)
      if(i.split('-').pop() === "search")
        delete data[i];
    delete data.markdown;
    delete data[''];

    let collections = getState().documents.collections;
    let name = path.split('/');
    name = name.pop();
    // Path değişiminde girecek
    if(path !== newPath && collections[name]) {
      delete collections[name];
      dispatch({ type: 'ADD_DIFF', diff: { [path]: {type: "delete"} } });

      collections = getState().tree.tree;
      let temp = newPath.split('/');
      temp.pop();
      for(let i in temp)
        if(temp.hasOwnProperty(i)) {
          if(!collections[temp[i]])
            collections[temp[i]] = {};
          if(!collections[temp[i]].file)
            collections = collections[temp[i]];
        }
      dispatch({ type: 'SET_DATA_SUCCESS', tree: collections });

    }

    path = newPath;
    name = path.split('/');
    name = name.pop();

    let document = {file: {path: path, content: getState().save.editor, isText: true}, content: data};
    // Yeni Kayıt
    if(!collections[name]) {
      collections[name] = document;
      //dispatch({ type: 'ADD_DOCUMENT_SUCCESS', document });
      status = "add";
    }
    else {
      dispatch({ type: 'ASSIGN_DOCUMENT_SUCCESS', document });
      status = "edit";
    }

    dispatch({ type: 'ADD_DIFF', diff: { [path]: {type: status, obj: document} } });
  };
}

export function updateEditor(editor) {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_EDITOR_SUCCESS', editor });
  };
}

export function commit(message) {
  return (dispatch, getState) => {
    let raw_tree = getState().tree.raw_tree;
    let tree = getState().tree.tree;
    let diff = getState().save.diff;

    for(let path in diff) {
      let obj = diff[path];
      let {node, name} = getNode(tree, path, true);
      switch(obj.type) {
        case "delete":
          for(let [index, value] of raw_tree.entries())
            if(value.path === path)
              raw_tree.splice(index, 1);

          if(node[name])
            delete node[name];
          break;
        case "rename":
          for(let [index, value] of raw_tree.entries())
            if(value.path === path)
              value.path = obj.to;

            if(node[name]) {
              node[name].file.path = obj.to;
              node[obj.to.split('/').pop()] = node[name];
              delete node[name];
            }
          break;
        case "edit":
          for(let [index, value] of raw_tree.entries())
            if(value.path === path)
              raw_tree[index] = {
                path: obj.obj.file.path,
                content: `---
${jsyaml.dump(obj.obj.content)}---
${obj.obj.file.content}`,
                mode: "100644",
                type: "blob"
              };

          node[name] = obj.obj;
          break;
        case "add":
          raw_tree.push({
            path: obj.obj.file.path,
            content: `---
${jsyaml.dump(obj.obj.content)}---
${obj.obj.file.content}`,
            mode: "100644",
            type: "blob"
          });

          node[name] = obj.obj;
          break;
      }
    }

    for(let [index, value] of raw_tree.entries())
      if(value.mode === "040000")
        raw_tree.splice(index, 1);
    console.log(raw_tree);
    commitStep2(dispatch, getState, raw_tree, message);
  };
}

function commitStep2(dispatch, getState, tree, message) {
  let repo = window.repo.split('/');
  let token = getState().tree.token;
  dispatch({ type: 'COMMIT_REQUEST' });
  fetch(`https://api.github.com/repos/${repo[0]}/${repo[1]}/git/trees`
    ,{ method: 'POST', body: JSON.stringify({tree: tree}), headers: { "Content-Type": "application/json;charset=UTF-8", "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
  )
    .then(res => res.json())
    .then(data => {
      if(data.message) {
        dispatch({ type: 'COMMIT_FAILURE', error: data.message});
        throw new Error(data.message);
      }

      let sha = data.sha;
      let commitData = {
          'message': "[A] "+message ,
          'parents': [getState().tree.lastCommitSha],
          'tree': sha
      };
      fetch(`https://api.github.com/repos/${repo[0]}/${repo[1]}/git/commits`
        ,{ method: 'POST', body: JSON.stringify(commitData), headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
      )
        .then(res => res.json())
        .then(data2 => {
          let headData = {
            'sha': data2.sha,
            'force': true
          };
          fetch(`https://api.github.com/repos/${repo[0]}/${repo[1]}/git/refs/heads/${repo[2]}`
            ,{ method: 'POST', body: JSON.stringify(headData), headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
          )
            .then(res => res.json())
            .then(data3 => {
              dispatch({ type: 'COMMIT_SUCCESS' });
            })
            .catch(error => {
              console.log(error.message);
            });
        })
        .catch(error => {
          console.log(error.message);
        });
    })
    .catch(error => {
      console.log(error.message);
    });
}

function getNode(tree2, path, obj = false) {
  let tree = tree2;
  let temp = path.split('/');
  let name;
  if(obj)
    name = temp.pop();
  for(let i in temp)
    if(temp.hasOwnProperty(i)) {
      if(!tree[temp[i]]) {
        console.log("Düğüm bulunamadı.");
        break;
      }
      tree = tree[temp[i]];
    }
  if(obj)
    return {node: tree, name};
  else
    return tree;
}