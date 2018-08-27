export default {
  methods: {
    getUploadIcon(last_upload) {
      if (!last_upload) return "ti-time";

      if (last_upload.includes("agora")) {
        return "ti-reload";
      } else if (last_upload.includes("dia")) {
        return "ti-calendar";
      } else if (last_upload.includes("hora")) {
        return "ti-timer";
      }

      return "";
    }
  }
};
