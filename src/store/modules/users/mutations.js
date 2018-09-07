export default {
  UPDATE_USER_LEVEL(state, payload) {
    state.user.isAdmin = payload;
  },
  UPDATE_USERNAME(state, payload) {
    state.user.username = payload;
  },
  UPDATE_UID(state, payload) {
    state.user.uid = payload;
  }
};
