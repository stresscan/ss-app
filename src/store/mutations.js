export default {
  CHANGE_USER_LEVEL(state, isAdmin) {
    state.user.isAdmin = isAdmin;
  }
};
