import fetch from 'isomorphic-fetch';
import localforage from 'localforage';
import jsyaml from 'js-yaml';


/*export function login(token, nextPath) {
  return (dispatch, getState) => {
    localforage.clear().then(function() {
        console.log('Database is now empty.');
        login2(token, nextPath)(dispatch, getState);
    });
  };
}*/

export function login(token, nextPath) {
  return (dispatch, getState) => {
      let repo = "";
      if(window.repo)
        repo = window.repo;
      else
        console.log("Repo bilgileri girilmemiş.");
      repo = repo.split('/');

      dispatch({ type: 'SET_NEXTPATH', path: nextPath });
      dispatch({ type: 'FETCH_USER_REQUEST' });
      fetch(`https://api.github.com/repos/${repo[0]}/${repo[1]}/git/refs/heads/${repo[2]}`
        ,{ method: 'GET', headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
      )
        .then(res => res.json())
        .then(data => {
          if(data.message === "Bad credentials")
            throw new Error("Geçersiz token");
          else if(getState().tree.lastCommitSha !== data.object.sha){
            dispatch({
              type: 'FETCH_USER_SUCCESS',
              token: token
            });
            //dispatch({ type: 'SET_OPTIONS' });
            fetchCommit(data.object, token)(dispatch);
          }
          else
            dispatch({ type: 'LOGIN_SUCCESS' });
        })
        .catch(error => {
          dispatch({
            type: 'FETCH_USER_FAILURE',
            error: error.message
          });
        });

      //setTimeout(() => {localStorage.setItem('token', token);dispatch({ type: 'FETCH_USER_FAILURE' });}, 5000);
  };
}

function fetchCommit(obj, token) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_COMMIT_REQUEST' });
    fetch(obj.url
      ,{ method: 'GET', headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
    )
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'FETCH_COMMIT_SUCCESS',
          sha: data.sha,
          author: data.author.name,
          date: data.author.date,
          message: data.message
        });
        fetchTree(data.tree.url, token)(dispatch);
      })
      .catch(error => {
        dispatch({
          type: 'FETCH_COMMIT_FAILURE'
        });
      });
  };
}

function fetchTree(obj, token) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_TREE_REQUEST' });
    fetch(obj+'?recursive=1'
      ,{ method: 'GET', headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
    )
      .then(res => res.json())
      .then(data => {
        if(data.truncated)
          throw new Error("Dosya sayısı çok fazla olduğu için liste alınamadı.");
        else {
          dispatch({
            type: 'FETCH_TREE_SUCCESS',
            sha: data.sha,
            length: data.tree.length,
            tree: data.tree
          });
          buildNewTree(data.tree, dispatch, token);
        }
      })
      .catch(error => {
        dispatch({
          type: 'FETCH_TREE_FAILURE'
        });
      });
  };
}

function buildNewTree(tree, dispatch, token) {
  let newTree = {};
  for(let i in tree) if(tree.hasOwnProperty(i)) {
    let temp = tree[i].path.split('/');
    const name = temp.pop();

    let node = newTree;
    for(let i2 in temp) {
      if(temp.hasOwnProperty(i2))
        node = node[temp[i2]];
    }
    if(tree[i].mode === "040000") {
      node[name] = {};
      continue;
    }
    node[name] = { file: tree[i], content: {} };

    if(name === "_admin_attr.yml") {
      dispatch({ type: 'SET_OPTIONS', path: node[name].file.path, options: node[name] });
      localforage.getItem(node[name].file.sha+':c').then(value => {node[name].file.content = value});
    }
    else if(name === "_admin_menu.yml") {
      dispatch({ type: 'SET_MENU', menu: node[name] });
      localforage.getItem(node[name].file.sha+':c').then(value => {node[name].file.content = value});
    }

    if(["markdown", "mkdown", "mkdn", "mkd", "md", "js", "css", "txt", "html", "htm", "json", "yml", "yaml"]
        .indexOf(name.substring(name.lastIndexOf(".")+1)) === -1) {
      continue;
    }
    node[name].file.isText = true;
    dispatch({ type: 'FETCH_BLOB_REQUEST' });
    localforage.getItem(tree[i].sha).then(value => {
        if(value === null) {
          fetch(tree[i].url
            ,{ method: 'GET', headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
          )
            .then(res => res.json())
            .then(data => {
              dispatch({
                type: 'FETCH_BLOB_SUCCESS',
                message: tree[i].path
              });
              fetchContent(node[name], b64DecodeUnicode(data.content));
            })
            .catch(error => {
              dispatch({
                type: 'FETCH_BLOB_FAILURE',
                error: error
              });
            });
        }
        else {
          node[name].content = value;
          dispatch({
            type: 'FETCH_BLOB_SUCCESS'
          });
        }
    }).catch(function(err) {
        console.log("error", err);
    });
    //if(i > 625) break;
  }
  dispatch({
    type: 'BUILD_TREE_SUCCESS',
    tree: newTree
  });
}

function fetchContent(data, content) {
  if(content.indexOf('---') === 0) {
    content = ["", content.substring(3, content.indexOf('---', 1)), content.substring(content.indexOf('---', 1)+3)];
    data.content = jsyaml.load(content[1]);
    if(!data.content) {
      data.content = {};
    }
    localforage.setItem(data.file.sha, data.content).catch(function(err) {console.log(err);});
    localforage.setItem(data.file.sha+':c', content[2].trim()).catch(function(err) {console.log(err);});
    data.file.content = content[2].trim();
  }
  else {
    localforage.setItem(data.file.sha, {}).catch(function(err) {console.log(err);});
    localforage.setItem(data.file.sha+':c', content.trim()).catch(function(err) {console.log(err);});
    data.file.content = content;
  }
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}