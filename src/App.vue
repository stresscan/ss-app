<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
import appService from "./services/AppService.js";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid
    })
  },
  mounted() {
    this.$nextTick(() => {
      // Add to Home Screen Chrome Banner User Response
      window.addEventListener("beforeinstallprompt", e => {
        e.userChoice.then(choiceResult => {
          appService.saveAdd2HomeScreenUserChoice(
            this.stateUid,
            choiceResult.outcome
          );
        });
      });
    });
  }
};
</script>

<style lang="scss">
.vue-notifyjs.notifications {
  .alert {
    z-index: 10000;
  }
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}
</style>
