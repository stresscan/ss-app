<template>
  <div class="wrapper" id="wrapper">
    <side-bar :title="stateUsername">
      <template slot="links">
        <sidebar-link to="/dashboard/index" name="Dashboard" icon="ti-panel" />
        <sidebar-link to="/dashboard/user-profile" name="Meus Dados" icon="ti-user" />
        <sidebar-link v-if="stateIsAdmin" to="/dashboard/users" name="Usuários" icon="fa fa-users" />
      </template>
      <mobile-menu>
        <drop-down class="nav-item" :hideArrow="true" :isMobileNotifications="true" :title="notificationsList.length + ' Notificações'" :title-classes="`nav-link ${notificationsList.length ? `text-danger` : ``}`" icon="ti-bell">
          <span class="dropdown-item" v-if="notificationsList.length === 0">Nenhuma notificação</span>
          <a v-for="item in notificationsList" :key="item.id" class="dropdown-item notifications-item" href="#" @click="onGoToNotification(item)">{{ item.msg }}</a>
        </drop-down>
        <li class="nav-item">
          <a href="#" @click="onGoToSettings" class="nav-link">
            <i class="ti-settings"></i>
            <p>Configurações</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar :uid="stateUid"></top-navbar>
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import { mapState } from "vuex";
import firebase from "firebase";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  data() {
    return {
      notificationsList: []
    };
  },
  computed: {
    ...mapState({
      stateUsername: state => state.users.user.username,
      stateIsAdmin: state => state.users.user.isAdmin,
      stateUid: state => state.users.user.uid
    })
  },
  created() {
    const getRealtimeNotificationsList = clientId => {
      firebase
        .firestore()
        .collection("notifications")
        .where("owner", "==", clientId)
        .orderBy("datetime", "desc")
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.notificationsList.unshift(
                Object.assign(change.doc.data(), {
                  id: change.doc.id
                })
              );
            }

            if (change.type === "removed") {
              this.notificationsList = this.notificationsList.filter(
                item => item.id !== change.doc.id
              );
            }
          });
        });
    };

    getRealtimeNotificationsList(this.stateUid);
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    onGoToNotification(notification) {
      this.$router.replace(notification.route);
    },
    onGoToSettings() {
      this.$sidebar.displaySidebar(false);
      this.$router.replace("/dashboard/index/settings");
    }
  }
};
</script>
<style>
.notification {
  margin-top: 5px;
}
</style>

