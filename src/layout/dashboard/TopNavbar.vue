<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{routeName}}</a>
      <button class="navbar-toggler navbar-burger" type="button" @click="toggleSidebar" :aria-expanded="$sidebar.showSidebar" aria-label="Toggle navigation">
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <drop-down class="nav-item" :isNotifications="true" :title="notificationsList.length + ' Notificações'" :title-classes="`nav-link ${notificationsList.length ? `text-danger` : ``}`" icon="ti-bell">
            <span class="dropdown-item" v-if="notificationsList.length === 0">Nenhuma notificação</span>
            <a v-for="item in notificationsList" :key="item.id" class="dropdown-item notifications-item" href="#" @click="onGoToNotification(item)">{{ item.body }}</a>
          </drop-down>
          <li class="nav-item">
            <a href="#" @click="onGoToSettings" class="nav-link">
              <i class="ti-settings"></i>
              <p>
                Configurações
              </p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import firebase from "firebase";

export default {
  props: {
    uid: {
      type: String
    }
  },
  data() {
    return {
      activeNotifications: false,
      notificationsList: []
    };
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  created() {
    console.log("uid", this.uid);
    const getNotReadNotifications = clientId => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("notifications")
          .where("owner", "==", clientId)
          .get()
          .then(querySnapshot => {
            let list = [];
            querySnapshot.forEach(doc => {
              list.push(Object.assign(doc.data(), { id: doc.id }));
            });

            resolve(list);
          });
      });
    };

    getNotReadNotifications(this.uid).then(list => {
      this.notificationsList = list;
      console.log(this.notificationsList);
    });
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    onGoToSettings() {
      this.$router.replace("/dashboard/index/settings");
    },
    onGoToNotification(notification) {
      console.log("onGoToNotification", notification);
      this.$router.replace(notification.route);
    }
  }
};
</script>
<style>
</style>