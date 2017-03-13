import localforage from 'localforage';
import jsyaml from 'js-yaml';

export function setList(path) {
  console.log("Liste oluşturuluyor...");
  return (dispatch, getState) => {
    dispatch({ type: 'SET_DATA_REQUEST' });
    let document = {
      file: { path: "", isText: true, content: "" },
      content: {}
    };
    let tree = getState().tree.tree;
    let temp = path.split('/');
    for(let i in temp)
      if(temp.hasOwnProperty(i)) {
        if(!tree[temp[i]])
          break;
        if(!tree[temp[i]].file)
          tree = tree[temp[i]];
        else
          document = tree[temp[i]];
      }
    dispatch({ type: 'UPDATE_EDITOR_REQUEST' });
    if(document.file && document.file.content === undefined) {
      localforage.getItem(document.file.sha+':c')
        .then(value => {
          document.file.content = value;
          dispatch({ type: 'SET_CONTENT_SUCCESS' });
          dispatch({ type: 'UPDATE_EDITOR_SUCCESS', editor: document.file.content });
        })
        .catch(function(err) {
          console.log("error", err);
        });
    }
    dispatch({ type: 'SET_DATA_SUCCESS', tree });
    dispatch({ type: 'SET_DOCUMENT_SUCCESS', document });
    if(document.file && document.file.content !== undefined) {
      dispatch({ type: 'UPDATE_EDITOR_SUCCESS', editor: document.file.content });
    }

    let { documents, files, directories} = extract(tree);
    dispatch({ type: 'SET_DOCUMENTS_SUCCESS', documents });
    dispatch({ type: 'SET_FILES_SUCCESS', files });
    dispatch({ type: 'SET_DIRECTORIES_SUCCESS', directories });

    let options = getType('/'+path, getState().tree.options);
    let variables = getAttrList(documents, options);
    dispatch({ type: 'SET_VARIABLES_SUCCESS', variables });
    for(let value of variables)
      if(!options[value]) {
        let varType = "";
        for(let value2 of documents) {
          if(Array.isArray(value2.content[value])) {
            if(!varType)
              varType = "Array";
            else if(varType !== "Array")
              varType = "Custom";
          }
          else if(typeof value2.content[value] === 'object') {
            if(!varType)
              varType = "Object";
            else if(varType !== "Object")
              varType = "Custom";
          }
          else if(Number.isInteger(value2.content[value])) {
            if(!varType)
              varType = "Number";
            else if(varType !== "Number")
              varType = "Custom";
          }
        }
        if(varType === "Custom" && document.content) {
          if(Array.isArray(document.content[value]))
            varType = "Array";
          else if(typeof document.content[value] === 'object')
            varType = "Object";
          else
            varType = "String";
        }
        else if(varType === "Custom")
          varType = "String";

        if(varType === "Array")
          varType = "select";
        else if(varType === "Number")
          varType = "number";
        else
          varType = "text";

        options[value] = {
          attr: value,
          title: value,
          list: {
            show: true
          },
          edit: {},
          input: {
            type: varType
          }
        };
      }
    dispatch({ type: 'SET_OPTIONS_SUCCESS', options });
  };
}

function extract(v) {
  let documents = [];
  let files = [];
  let directories = [];
  for(let i in v) if(v.hasOwnProperty(i)) {
    if(!v[i].file)
      directories.push(i);
    else if(!v[i].file.isText)
      files.push(v[i]);
    else
      documents.push(v[i]);
  }
  return { documents, files, directories};
}

function getType(v, arr) {
  let dataTemp = {};
  for(let i in arr) {
    let data = jsyaml.load(arr[i].file.content);
    if(v.indexOf(i) !== -1)
      for(let i2 in data) if(data.hasOwnProperty(i2))
        dataTemp[data[i2].attr] = data[i2];
  }
  return dataTemp;
}

function getAttrList(index, type) {
  let ret = [];
  let count = {};
  let c = 0;
  for(let i in index) if(index.hasOwnProperty(i)) {
    ++c;
    let data2 = index[i];
    for(let i2 in data2.content) {
      if(count[i2] === undefined)
        count[i2] = 1;
      else
        ++count[i2];
    }
  }
  count['file.path'] = c;
  // Sıralayalım.
  let sortable = [];
  for (let i in count) if(count.hasOwnProperty(i))
    sortable.push([i, count[i]]);
  sortable.sort(function(a, b) { return b[1] - a[1]; });

  for(let i in sortable) if(sortable.hasOwnProperty(i)) {
    sortable[i][1] = sortable[i][1] / c * 100;
    if(sortable[i][1] > 50 && !(type[sortable[i][0]] && type[sortable[i][0]].list.show === false) && ret.length < 10)
      ret.push(sortable[i][0]);
  }

  return ret;
}