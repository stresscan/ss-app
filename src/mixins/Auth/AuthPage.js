import { mapState, mapActions } from "vuex";
import authService from "@/services/AuthService";
import usersProfileService from "@/services/UsersProfileService";

export default {
  computed: {
    ...mapState({
      stateUsername: state => state.users.user.username,
      stateIsAdmin: state => state.users.user.isAdmin,
      stateUid: state => state.users.user.uid
    })
  },
  async beforeCreate() {
    const connectedUser = await authService.getCurrentUserObservable();
    if (!connectedUser) this.$router.replace("/login");
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
      this.updateState_UID(user.uid || "");
      this.updateState_PushNotificationsEnable(
        user.push_notifications_enable || false
      );
    }
  }
};
