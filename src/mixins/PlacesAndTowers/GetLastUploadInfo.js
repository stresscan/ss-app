import { getDateDiffInMinutes } from "@/utils/Dates/getDateDiffs";

export default {
  methods: {
    getLastUpload(datetime) {
      if (!datetime) {
        return {
          icon: "ti-time",
          text: "Aguardando sincronização"
        };
      }

      const diff = getDateDiffInMinutes(
        new Date(datetime).getTime(),
        Date.now()
      );

      if (diff <= 1) {
        return {
          icon: "ti-reload",
          text: "Atualizado agora"
        };
      } else if (diff < 45) {
        return {
          icon: "ti-reload",
          text: `Atualizado há ${Math.round(diff)} minutos`
        };
      } else if (diff < 60) {
        return {
          icon: "ti-time",
          text: "Atualizado há menos de 1 hora"
        };
      } else if (diff >= 60 && diff / 60 <= 24) {
        return {
          icon: "ti-timer",
          text: "Atualizado há algumas horas"
        };
      } else if (diff / 60 > 24 && diff / 60 <= 24 * 5) {
        return {
          icon: "ti-calendar",
          text: "Atualizado há mais de 1 dia"
        };
      } else {
        return {
          icon: "ti-calendar",
          text: "Atualizado há mais de 5 dia"
        };
      }
    }
  }
};
