import { opts } from "./NotifyOptions.js";

export const notify = {
  methods: {
    notify(msg, icon, type) {
      this.$notify({
        horizontalAlign: opts.horizontalAlign,
        verticalAlign: opts.verticalAlign,
        message: msg,
        icon,
        type
      });
    },
    notifySuccess(payload) {
      this.notify(payload.msg, opts.iconSuccess, "success");
    },
    notifyError(payload) {
      this.notify(payload.msg, opts.iconError, "danger");
    },
    notifyInfo(payload) {
      this.notify(payload.msg, opts.iconInfo, "info");
    },
    notifyNetwork(payload) {
      this.notify(payload.msg, opts.iconNetwork, "warning");
    }
  }
};
