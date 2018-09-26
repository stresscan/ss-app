<template>
  <div class="content">
    <div class="container-fluid">
      <online-offline @detected-condition="handleConnectivityChange" />
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import OnlineOffline from "v-offline";
import { EventBus } from "@/event-bus.js";

export default {
  components: {
    OnlineOffline
  },
  methods: {
    handleConnectivityChange(status) {
      console.log({ onlineMainContent: status });
      EventBus.$emit("connectivity-has-changed", { online: status });
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
  /* .fade-leave-active in <2.1.8 */

 {
  opacity: 0;
}
</style>
