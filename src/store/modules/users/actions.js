export default {
  updateState_UserLevel(context, payload) {
    context.commit("UPDATE_STATE_USER_LEVEL", payload);
  },
  updateState_Username(context, payload) {
    context.commit("UPDATE_STATE_USERNAME", payload);
  },
  updateState_UID(context, payload) {
    context.commit("UPDATE_STATE_UID", payload);
  },
  updateState_PushNotificationsEnable(context, payload) {
    context.commit("UPDATE_STATE_PUSHNOTIFICATIONSENABLE", payload);
  }
};
