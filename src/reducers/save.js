export function save(state = {
  editor: "",
  isLoading: false,
  commitStatus: 0,
  error: "",
  documents: {},
  files: [],
  filesLength: 0,
  diff: {}
}, action) {
  switch (action.type) {
    case 'UPDATE_EDITOR_REQUEST':
      return Object.assign({}, state, {
        isLoading: true
      });
    case 'UPDATE_EDITOR_SUCCESS':
      return Object.assign({}, state, {
        editor: action.editor,
        isLoading: false
      });
    case 'ADD_DIFF':
      console.log(state.diff);
      return Object.assign({}, state, {
        diff: Object.assign(state.diff, action.diff)
      });
    case 'COMMIT_REQUEST':
      return Object.assign({}, state, {
        commitStatus: 1
      });
    case 'COMMIT_SUCCESS':
      return Object.assign({}, state, {
        commitStatus: 2
      });
    case 'COMMIT_FAILURE':
      return Object.assign({}, state, {
        commitStatus: 3,
        error: action.error
      });
    case 'ADD_FILE':
      state.files.push(action.file);
      return Object.assign({}, state, {
        filesLength: state.filesLength + 1
      });
    case 'ADD_DOCUMENT':
      return Object.assign({}, state, {
        documents: Object.assign({}, state.documents, action.doc)
      });
    default:
      return state;
  }
}
