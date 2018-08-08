export default {
  CHANGE_USER_LEVEL(state, payload) {
    state.user.isAdmin = payload;
  }
};
