export function tree(state = {
  token: "",
  isLogin: false,
  isLoading: false,
  hasErrored: false,
  error: "",
  progressPercent: -1,
  progressMessage: "",
  lastCommitSha: "",
  lastCommitAuthor: "",
  lastCommitDate: "",
  lastCommitMessage: "",
  treeSha: "",
  treeLength: 0,
  treeRealLength: 0,
  counter: 1,
  updated: true,
  tree: {},
  raw_tree: [],
  options: {},
  menu: {},
  nextPath: "/"
}, action) {
  switch (action.type) {
    case 'SET_NEXTPATH':
      return Object.assign({}, state, {
        nextPath: action.path
      });
    case 'FETCH_BLOB_REQUEST':
      return Object.assign({}, state, {
        treeRealLength: state.treeRealLength + 1
      });
    case 'FETCH_TREE_REQUEST':
      return Object.assign({}, state, {
        isLoading: true,
        progressMessage: "Dosya listesi alınıyor...",
        progressPercent: 1
      });
    case 'FETCH_COMMIT_REQUEST':
      return Object.assign({}, state, {
        isLoading: true,
        progressMessage: "Son kayıt alınıyor...",
        progressPercent: 0
      });
    case 'FETCH_USER_REQUEST':
      return Object.assign({}, state, {
        hasErrored: false,
        isLoading: true,
        progressMessage: "Bağlanılıyor...",
        progressPercent: 0,
        isLogin: false,
        counter: 1,
        treeRealLength: 0,
        treeLength: 0
      });
    case 'BUILD_TREE_SUCCESS':
      return Object.assign({}, state, {
        tree: action.tree
      });
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        isLogin: true,
        updated: false
      });
    case 'FETCH_BLOB_SUCCESS':
      return Object.assign({}, state, {
        //isLoading: ((state.treeRealLength === state.counter) ? false : true),
        counter: (state.counter + 1),
        progressPercent: (1 + Math.floor(state.counter*100/state.treeRealLength)),
        progressMessage: action.message,
        isLogin: (state.treeRealLength === state.counter?true:false)
      });
    case 'FETCH_TREE_SUCCESS':
      return Object.assign({}, state, {
        treeSha: action.sha,
        treeLength: action.length,
        raw_tree: action.tree.slice(0)
      });
    case 'FETCH_COMMIT_SUCCESS':
      return Object.assign({}, state, {
        lastCommitSha: action.sha,
        lastCommitAuthor: action.author,
        lastCommitDate: action.date,
        lastCommitMessage: action.message
      });
    case 'FETCH_USER_SUCCESS':
      return Object.assign({}, state, {
        token: action.token
      });
    case 'FETCH_BLOB_FAILURE':
      return Object.assign({}, state, {
        isLoading: false,
        hasErrored: true,
        error: action.error
      });
    case 'FETCH_TREE_FAILURE':
      return Object.assign({}, state, {
        isLoading: false,
        hasErrored: true,
        error: "Dosya listesi alınamadı."
      });
    case 'FETCH_COMMIT_FAILURE':
      return Object.assign({}, state, {
        isLoading: false,
        hasErrored: true,
        error: "Son kayıt alınamadı."
      });
    case 'FETCH_USER_FAILURE':
      return Object.assign({}, state, {
        isLoading: false,
        hasErrored: true,
        error: action.error
      });
    case 'SET_OPTIONS':
      state.options['/'+action.path.substr(0, action.path.lastIndexOf('/'))] = action.options;
      return state;
    case 'SET_MENU':
      return Object.assign({}, state, {
        menu: action.menu
      });
    default:
      return state;
  }
}
