export default {
  updateUserLevel(context, payload) {
    context.commit("UPDATE_USER_LEVEL", payload);
  },
  updateUsername(context, payload) {
    context.commit("UPDATE_USERNAME", payload);
  },
  updateUID(context, payload) {
    context.commit("UPDATE_UID", payload);
  },
  updatePushNotificationsEnable(context, payload) {
    context.commit("UPDATE_PUSHNOTIFICATIONSENABLE", payload);
  }
};
