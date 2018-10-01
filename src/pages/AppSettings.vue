<template>
  <div>
    <h3>Configurações</h3>
    <ss-toggle-button :sync="true" v-model="pushNotificationsEnable" @change="onTogglePushNotifications" />
    <span class="d-inline-block position-relative mg-lf-xxs" style="top: -2px">Receber Push Notifications</span>
  </div>
</template>

<script>
import service from "@/services/PushNotificationsService.js";

import { mapState, mapActions } from "vuex";
import basicPageMixin from "@/mixins/BasicPage.js";
import logService from "@/services/LogService.js";

export default {
  mixins: [basicPageMixin],
  data() {
    return {
      pushNotificationsEnable: false
    };
  },
  components: {
    //ToggleButton
  },
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid,
      statePushNotificationsEnable: state =>
        state.users.user.push_notifications_enable
    })
  },
  created() {
    this.pushNotificationsEnable = this.statePushNotificationsEnable;
  },
  methods: {
    ...mapActions(["updateStatePushNotificationsEnable"]),
    setPushNotificationsEnable(uid, value) {
      this.pushNotificationsEnable = value;
      this.updateStatePushNotificationsEnable(value);
      service.updatePushNotificationEnable(uid, value);
    },
    async onTogglePushNotifications(toggle) {
      console.log("this.pushNotificationsEnable", this.pushNotificationsEnable);
      console.log("toggle.value", toggle.value);
      if (toggle.value) {
        // const currentToken = await askForPermissioToReceiveNotifications();
        service.authorizeNotification();
        // .then(currentToken => {
        //   console.log("authorizeNotification", currentToken);

        //   if (currentToken) {
        //     this.setPushNotificationsEnable(this.stateUid, true);
        //     service.updateUserPermissionToken(this.stateUid, currentToken);
        //   } else {
        //     this.setPushNotificationsEnable(this.stateUid, false);
        //     console.log(
        //       `No Instance ID token available. Request permission to generate one.`
        //     );
        //     console.log(
        //       "this.pushNotificationsEnable",
        //       this.pushNotificationsEnable
        //     );
        //   }
        // })
        // .catch(err => {
        //   console.log({ err });
        //   this.setPushNotificationsEnable(this.stateUid, false);
        // });
      }
    }
  }
};
</script>
<style>
</style>
