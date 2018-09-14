<template>
  <div class="wrapper" id="wrapper">
    <side-bar :title="username">
      <template slot="links">
        <sidebar-link to="/dashboard/index" name="Dashboard" icon="ti-panel" />
        <sidebar-link to="/dashboard/user-profile" name="Meus Dados" icon="ti-user" />
        <sidebar-link v-if="stateIsAdmin" to="/dashboard/users" name="Usuários" icon="fa fa-users" />
      </template>
      <mobile-menu>
        <drop-down class="nav-item" title="5 Notifications" title-classes="nav-link" icon="ti-bell">
          <a class="dropdown-item">Notification 1</a>
          <a class="dropdown-item">Notification 2</a>
          <a class="dropdown-item">Notification 3</a>
          <a class="dropdown-item">Notification 4</a>
          <a class="dropdown-item">Another notification</a>
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
  computed: {
    username: () => firebase.auth().currentUser.displayName,
    ...mapState({
      stateIsAdmin: state => state.users.user.isAdmin,
      stateUid: state => state.users.user.uid
    })
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    onGoToSettings() {
      this.$sidebar.displaySidebar(false);
      this.$router.replace("/dashboard/index/settings");
    }
  }
};
</script>
