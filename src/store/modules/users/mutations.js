export default {
  UPDATE_USER_LEVEL(state, payload) {
    state.user.isAdmin = payload;
  },
  UPDATE_USERNAME(state, payload) {
    state.user.username = payload;
  },
  UPDATE_UID(state, payload) {
    state.user.uid = payload;
  },
  UPDATE_PUSHNOTIFICATIONSENABLE(state, payload) {
    state.user.push_notifications_enable = payload;
  }
};
