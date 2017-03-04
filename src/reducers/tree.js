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
      return Object.assign({}, state, {
        options: {
          "/": [
            {
              attr: "file.path",
              title: "Konum",
              list: {
                show: false
              },
              edit: {
                order: 1,
                section: 2
              },
              input: {
                type: "text"
              }
            },
            {
              attr: "title",
              title: "Başlık",
              list: {
                show: true
              },
              edit: {
                order: 1
              },
              input: {
                type: "text"
              }
            },
            {
              attr: "file.content",
              title: "İçerik",
              list: {
                show: false
              },
              edit: {
                type: 2,
                order: 1,
                section: 3
              },
              input: {
                type: "editor"
              }
            }
          ],
          "/_posts": [
            {
              attr: "title",
              title: "Makale Başlığı",
              list: {
                show: true
              },
              edit: {
                type: 2,
                order: 1
              },
              input: {
                type: "text"
              }
            },
            {
              attr: "summary",
              title: "Özet",
              list: {
                show: false
              },
              edit: {
                type: 2,
                order: 2
              },
              input: {
                type: "text",
                rows: 2
              }
            },
            {
              attr: "image",
              title: "Resim",
              list: {
                show: false
              },
              edit: {
                type: 2,
                order: 6
              },
              input: {
                type: "text"
              }
            },
            {
              attr: "thumb",
              title: "Resim",
              list: {
                show: false
              },
              edit: {
                type: 2,
                order: 6
              },
              input: {
                type: "text"
              }
            },
            {
              attr: "permalink",
              title: "Permalink",
              list: {
                show: false
              },
              edit: {
                type: 2,
                order: 2,
                section: 2
              },
              input: {
                type: "text"
              }
            },
            {
              attr: "date",
              title: "Zaman",
              list: {
                show: true
              },
              edit: {
                type: 2,
                order: 3,
                section: 2
              },
              input: {
                type: "date"
              }
            },
            {
              attr: "author",
              title: "Yazar",
              list: {
                show: true
              },
              edit: {
                type: 2,
                order: 5
              },
              input: {
                type: "select",
                isRelated: true,
                multiple: false,
                path: "_other/author",
                options: [
                  {
                    attr: "file.path",
                    value: "_other/author/",
                    op: "contain"
                  }
                ],
                value: "title"
              }
            },
            {
              attr: "categories",
              title: "Kategori",
              list: {
                show: true
              },
              edit: {
                type: 2,
                order: 3
              },
              input: {
                type: "select",
                isRelated: true,
                multiple: false,
                path: "_category",
                options: [
                  {
                    attr: "file.path",
                    value: "_category/",
                    op: "contain"
                  }
                ],
                value: "code"
              }
            },
            {
              attr: "tags",
              title: "Etiketler",
              list: {
                show: false
              },
              edit: {
                type: 2,
                order: 4
              },
              input: {
                type: "select",
                isRelated: true,
                multiple: true,
                path: "_tag",
                options: [
                  {
                    attr: "file.path",
                    value: "_tag/",
                    op: "contain"
                  }
                ],
                value: "title"
              }
            }
          ]
        }
      });
    default:
      return state;
  }
}
