import localforage from 'localforage';

export function setList(path) {
  console.log("Liste oluşturuluyor...");
  return (dispatch, getState) => {
    dispatch({ type: 'SET_DATA_REQUEST' });
    let document = {};
    let tree = getState().tree.tree;
    let temp = path.split('/');
    for(let i in temp)
      if(temp.hasOwnProperty(i)) {
        if(!tree[temp[i]].file)
          tree = tree[temp[i]];
        else
          document = tree[temp[i]];
      }
    if(document.file && !document.file.content) {
      localforage.getItem(document.file.sha+':c')
        .then(value => {
          document.file.content = value;
          dispatch({ type: 'SET_CONTENT_SUCCESS' });
        })
        .catch(function(err) {
          console.log("error", err);
        });
    }
    dispatch({ type: 'SET_DATA_SUCCESS', tree });
    dispatch({ type: 'SET_DOCUMENT_SUCCESS', document });

    let { documents, files, directories} = extract(tree);
    dispatch({ type: 'SET_DOCUMENTS_SUCCESS', documents });
    dispatch({ type: 'SET_FILES_SUCCESS', files });
    dispatch({ type: 'SET_DIRECTORIES_SUCCESS', directories });

    let options = getType('/'+path, getState().tree.options);
    let variables = getAttrList(documents, options);
    dispatch({ type: 'SET_VARIABLES_SUCCESS', variables });
    for(let value of variables)
      if(!options[value])
        options[value] = {
          attr: value,
          title: value,
          list: {
            show: true
          },
          edit: {},
          input: {
            type: "text"
          }
        };
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
    if(v.indexOf(i) !== -1)
      for(let i2 in arr[i]) if(arr[i].hasOwnProperty(i2))
        dataTemp[arr[i][i2].attr] = arr[i][i2];
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