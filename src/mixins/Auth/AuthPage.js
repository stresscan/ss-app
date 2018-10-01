import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      stateUsername: state => state.users.user.username,
      stateIsAdmin: state => state.users.user.isAdmin,
      stateUid: state => state.users.user.uid
    })
  },
  methods: {
    isAdmin() {
      return String(this.stateIsAdmin) == "true";
    },
    ...mapActions([
      "updateState_UserLevel",
      "updateState_Username",
      "updateState_UID",
      "updateState_PushNotificationsEnable"
    ]),
    updateUserState(user) {
      this.updateState_UserLevel(user.isAdmin || false);
      this.updateState_Username(user.username || "");
      this.updateState_UID(user.id || "");
      this.updateState_PushNotificationsEnable(
        user.push_notifications_enable || false
      );
    }
  }
};
