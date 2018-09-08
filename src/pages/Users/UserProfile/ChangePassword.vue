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
import firebase from "firebase";

export default {
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
    onChangePassword() {
      this.sendingEmail = true;

      firebase.auth().languageCode = "pt-br";

      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          console.log("email sent");

          this.emailSent = true;
          this.sendingEmail = false;

          this.$emit("notifyVue", {
            verticalAlign: "bottom",
            horizontalAlign: "right",
            type: "success",
            message: "E-mail com instruções foi enviado com sucesso",
            icon: "ti-thumb-up"
          });
        })
        .catch(e => {
          this.sendingEmail = false;

          this.$emit("notifyVue", {
            verticalAlign: "bottom",
            horizontalAlign: "right",
            type: "danger",
            message: "Ocorreu um erro inesperado, por favor tente novamente",
            icon: "ti-thumb-down"
          });
        });
    },
    onResendEmail() {
      this.emailSent = false;
    }
  }
};
</script>
