const getDateDiffInHours = (dt1, dt2) => {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60;
  return diff;
};

export default {
  methods: {
    getLastUpload(datetime) {
      if (!datetime) {
        return {
          icon: "ti-time",
          text: "Aguardando sincronização"
        };
      }

      const diff = getDateDiffInHours(new Date(datetime).getTime(), Date.now());

      console.log({ diff });

      if (diff < 0.1) {
        return {
          icon: "ti-reload",
          text: "Atualizado agora"
        };
      } else if (diff < 0.2) {
        return {
          icon: "ti-reload",
          text: "Atualizado há poucos minutos"
        };
      } else if (diff < 0) {
        return {
          icon: "ti-time",
          text: "Atualizado há menos de 1 hora"
        };
      } else if (diff > 0 && diff < 12) {
        return {
          icon: "ti-time",
          text: "Atualizado há menos de 12 horas"
        };
      } else if (diff < 24) {
        return {
          icon: "ti-timer",
          text: "Atualizado há mais de 12 horas"
        };
      }

      return {
        icon: "ti-calendar",
        text: "Atualizado há mais de 1 dia"
      };

      // if (datetime.includes("agora")) {
      //   return {
      //     icon: "ti-reload",
      //     text: "Atualizado agora"
      //   };
      // } else if (datetime.includes("dia")) {
      //   return {
      //     icon: "ti-calendar",
      //     text: "Atualizado há mais de 1 dia"
      //   };
      // } else {
      //   return {
      //     icon: "ti-timer",
      //     text: "Atualizado há algumas horas"
      //   };
      // }
    }
  }
};
