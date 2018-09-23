import { options } from "./NotifyOptions.js";

export const emitNotify = {
  methods: {
    emitNotify(data) {
      this.$emit("notifyVue", {
        verticalAlign: data.verticalAlign || options.verticalAlign,
        horizontalAlign: data.horizontalAlign || options.horizontalAlign,
        message: data.message,
        icon: data.icon,
        type: data.type
      });
    },
    emitNotifyError(message) {
      this.$emit("notifyVue", {
        verticalAlign: options.verticalAlign,
        horizontalAlign: options.horizontalAlign,
        message,
        icon: options.iconError,
        type: "danger"
      });
    },
    emitNotifySuccess(message) {
      this.$emit("notifyVue", {
        verticalAlign: options.verticalAlign,
        horizontalAlign: options.horizontalAlign,
        message,
        icon: options.iconSuccess,
        type: "success"
      });
    },
    emitNotifyInfo(message) {
      this.$emit("notifyVue", {
        verticalAlign: options.verticalAlign,
        horizontalAlign: options.horizontalAlign,
        message,
        icon: options.iconInfo,
        type: "info"
      });
    },
    emitNotifyNetwork(message) {
      this.$emit("notifyVue", {
        verticalAlign: options.verticalAlign,
        horizontalAlign: options.horizontalAlign,
        message,
        icon: options.iconNetwork,
        type: "warning"
      });
    }
  }
};
