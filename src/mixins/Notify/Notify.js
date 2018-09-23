import { options } from "./NotifyOptions.js";

export const notify = {
  methods: {
    notify(data) {
      this.$notify({
        horizontalAlign: data.horizontalAlign || options.horizontalAlign,
        verticalAlign: data.verticalAlign || options.verticalAlign,
        message: data.message,
        icon: data.icon,
        type: data.type
      });
    },
    notifySuccess(message) {
      this.$notify({
        horizontalAlign: options.horizontalAlign,
        verticalAlign: options.verticalAlign,
        message,
        icon: options.iconSuccess,
        type: "success"
      });
    },
    notifyError(message) {
      this.$notify({
        horizontalAlign: options.horizontalAlign,
        verticalAlign: options.verticalAlign,
        message,
        icon: options.iconError,
        type: "danger"
      });
    },
    notifyInfo(message) {
      this.$notify({
        horizontalAlign: options.horizontalAlign,
        verticalAlign: options.verticalAlign,
        message,
        icon: options.iconInfo,
        type: "info"
      });
    }
  }
};
