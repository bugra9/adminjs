export function system(state = {
  sidebarVisible: true
}, action) {
  switch (action.type) {
    case 'LEFT_SIDEBAR_TOGGLE':
      return {
        sidebarVisible: !state.sidebarVisible
      };
    default:
      return state;
  }
}
