export default {
  methods: {
    getLastUpload(datetime) {
      if (!datetime) {
        return {
          icon: "ti-time",
          text: "Aguardando sincronização"
        };
      }

      if (datetime.includes("agora")) {
        return {
          icon: "ti-reload",
          text: "Atualizado agora"
        };
      } else if (datetime.includes("dia")) {
        return {
          icon: "ti-calendar",
          text: "Atualizado há mais de 1 dia"
        };
      } else {
        return {
          icon: "ti-timer",
          text: "Atualizado há algumas horas"
        };
      }
    }
  }
};
