export function sidebarToggle() {
  return (dispatch) => {
      dispatch({ type: 'LEFT_SIDEBAR_TOGGLE' });
  };
}
