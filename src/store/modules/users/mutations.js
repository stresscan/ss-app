export default {
  UPDATE_STATE_USER_LEVEL(state, payload) {
    state.user.isAdmin = payload;
  },
  UPDATE_STATE_USERNAME(state, payload) {
    state.user.username = payload;
  },
  UPDATE_STATE_UID(state, payload) {
    state.user.uid = payload;
  },
  UPDATE_STATE_PUSHNOTIFICATIONSENABLE(state, payload) {
    state.user.push_notifications_enable = payload;
  }
};
