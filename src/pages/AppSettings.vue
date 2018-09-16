<template>
  <div>
    <h3>Configurações</h3>
    <toggle-button @change="onTogglePushNotifications" v-model="pushNotificationsEnable" />
    <span class="d-inline-block position-relative mg-lf-xxs" style="top: -2px">Receber Push Notifications</span>
  </div>
</template>

<script>
import {
  askForPermissioToReceiveNotifications,
  saveUserPermissionToken,
  savePushNotificationEnable
} from "@/services/PushNotificationsService.js";

import { mapState, mapActions } from "vuex";
import basePage from "@/mixins/BasePage.js";
import logService from "@/services/LogService.js";
import ToggleButton from "vue-js-toggle-button/src/Button";

export default {
  data() {
    return {
      pushNotificationsEnable: false
    };
  },
  components: {
    ToggleButton
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
    ...mapActions(["updatePushNotificationsEnable"]),
    async onTogglePushNotifications() {
      savePushNotificationEnable(this.stateUid, this.pushNotificationsEnable);
      this.updatePushNotificationsEnable(this.pushNotificationsEnable);

      if (this.pushNotificationsEnable) {
        const token = await askForPermissioToReceiveNotifications();
        if (token) {
          saveUserPermissionToken(this.stateUid, token);
        }
      }
    }
  }
};
</script>
<style>
</style>
