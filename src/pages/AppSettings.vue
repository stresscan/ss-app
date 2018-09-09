<template>
  <div>
    <h3>Configurações</h3>
    <a href="#" @click.prevent="onTogglePushNotifications">Receber Notificações</a>
  </div>
</template>

<script>
import {
  askForPermissioToReceiveNotifications,
  saveUserPermissionToken
} from "@/services/PushNotificationsService.js";
import { mapState } from "vuex";
import basePage from "@/mixins/BasePage.js";
import logService from "@/services/LogService.js";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid
    })
  },
  methods: {
    async onTogglePushNotifications() {
      const token = await askForPermissioToReceiveNotifications();
      console.log({ token });
      saveUserPermissionToken(this.stateUid, token);
    }
  }
};
</script>
<style>
</style>
