<template>
  <card class="card" :centerTitle="true" title="Alterar Senha">
    <div class="text-center">
      <div v-if="sendingEmail" class="ss-inline-spinner el-center mg-bt-md"></div>
      <div v-if="!sendingEmail && !emailSent">
        <p>
          Para alterar sua senha enviaremos um email para
          <b>{{ email }}</b> com intruções
        </p>
        <p-button type="info" round @click.native.prevent="onChangePassword">
          Enviar email com instruções
        </p-button>
      </div>
      <div v-if="emailSent">
        <p class="text-success">
          <i class="ti-check mg-rg-xxs"></i>
          <b>E-mail enviado com sucesso</b>
        </p>
        <a href="#" @click.prevent="onResendEmail">Reenviar e-mail</a>
      </div>
    </div>
  </card>
</template>

<script>
import { emitNotifyMixin } from "@/mixins/Notify";
import authService from "@/services/AuthService";

export default {
  mixins: [emitNotifyMixin],
  data() {
    return {
      sendingEmail: false,
      emailSent: false
    };
  },
  props: {
    email: String
  },
  methods: {
    async onChangePassword() {
      this.sendingEmail = true;

      try {
        await authService.sendPasswordResetEmail(this.email);
        console.log("email sent");

        this.emailSent = true;
        this.sendingEmail = false;

        this.emitNotify({
          type: "Success",
          msg: "E-mail com instruções foi enviado com sucesso"
        });
      } catch (e) {
        console.error({ e });
        this.sendingEmail = false;

        this.emitNotify({
          type: "Error",
          msg: "Ocorreu um erro inesperado, por favor tente novamente"
        });
      }
    },
    onResendEmail() {
      this.emailSent = false;
    }
  }
};
</script>
