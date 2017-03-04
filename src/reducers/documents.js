export function documents(state = {
  collections: {},
  documents: [],
  files: [],
  directories: [],
  options: {},
  variables: [],
  document: {},
  content: false,
  isLoading: false
}, action) {
  switch (action.type) {
    case 'SET_DATA_REQUEST':
      return Object.assign({}, state, {
        isLoading: true
      });
    case 'SET_DATA_SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
        collections: action.tree
      });
    case 'SET_OPTIONS_SUCCESS':
      return Object.assign({}, state, {
        isLoading: true,
        options: action.options
      });
    case 'SET_VARIABLES_SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
        variables: action.variables
      });
    case 'SET_DOCUMENTS_SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
        documents: action.documents
      });
    case 'SET_FILES_SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
        files: action.files
      });
    case 'SET_DIRECTORIES_SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
        directories: action.directories
      });
    case 'SET_DOCUMENT_SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
        content: false,
        document: action.document
      });
    case 'ASSIGN_DOCUMENT_SUCCESS':
      return Object.assign({}, state, {
        document: Object.assign(state.document, action.document)
      });
    case 'SET_CONTENT_SUCCESS':
      return Object.assign({}, state, {
        content: true
      });
    case 'ADD_DOCUMENT_SUCCESS':
      return Object.assign({}, state, {
        collections: Object.assign(state.collections, action.document),
        document: action.document
      });

    default:
      return state;
  }
}