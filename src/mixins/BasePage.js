import { scrollTopMixin } from "./ScrollTopOnCreate";
import { EventBus } from "@/event-bus.js";

export default {
  mixins: [scrollTopMixin],
  data() {
    return {
      reactiveOnlineApp: true
    };
  },
  beforeCreate() {
    EventBus.$on("connectivity-has-changed", status => {
      this.reactiveOnlineApp = status.online;
    });
  }
};
