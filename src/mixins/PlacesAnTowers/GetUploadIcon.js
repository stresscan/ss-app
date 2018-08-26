export default {
  methods: {
    getUploadIcon(last_upload) {
      if (last_upload) {
        if (last_upload.includes("agora")) {
          return "ti-reload";
        } else if (last_upload.includes("dia")) {
          return "ti-calendar";
        } else if (last_upload.includes("hora")) {
          return "ti-timer";
        } else {
          return "ti-time";
        }
      }

      return "";
    }
  }
};
