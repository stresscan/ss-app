<template>
  <div class="form-wrapper">
    <div v-if="loading">Carregando...</div>
    <div v-if="authenticating">Autenticando...</div>
    <form v-if="!loading && !authenticating" @submit.prevent="onLogin">
      <i class="material-icons" style="opacity: 0">cloud_off</i>
      <h1>Login</h1>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <label for="email">email</label>
      <input type="email" v-model="email" id="email">
      <label for="pwd">Senha</label>
      <input type="password" v-model="password" id="pwd">
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import offlineUserService from "@/services/offline/OfflineUsersService";
import authService from "@/services/AuthService";
import usersProfileService from "@/services/UsersProfileService";
import basicPageMixin from "@/mixins/BasicPage";
import authPageMixin from "@/mixins/Auth/AuthPage";
import { notifyMixin } from "@/mixins/Notify";

export default {
  mixins: [basicPageMixin, authPageMixin, notifyMixin],
  data() {
    return {
      email: "",
      password: "",
      loading: true,
      authenticating: false,
      errorMessage: ""
    };
  },
  async created() {
    console.log("login");
    const connectedUser = await authService.getCurrentUserObservable();

    console.log({ connectedUser });

    let user = null;

    if (connectedUser) {
      try {
        user = await usersProfileService.get(connectedUser.uid);
        offlineUserService.persiste(user);
      } catch (e) {
        console.error({ e });

        try {
          user = await offlineUserService.getUser();
        } catch (e) {
          console.error({ e });
        }
      }
    }

    console.log({ user });

    if (user) {
      console.log("redirecting to dashboard");
      this.updateUserState(user);
      this.$router.replace("/dashboard");
    } else {
      console.log("Perfil de usuário não encontrado");
      this.updateUserState({});
      this.loading = false;
    }
  },
  methods: {
    async onLogin() {
      this.authenticating = true;

      try {
        const connectedUser = await authService.signInWithEmailAndPassword(
          this.email,
          this.password
        );

        try {
          const user = await usersProfileService.get(connectedUser.uid);

          console.log({ user });

          if (user) {
            this.updateUserState({
              uid: user.uid,
              isAdmin: user.isAdmin,
              username: user.username,
              push_notifications_enable: user.push_notifications_enable
            });

            this.$router.replace("/dashboard");
          } else {
            this.authenticating = false;
            this.errorMessage = "Perfil de usuário não encontrado";
          }
        } catch (e) {
          console.error({ e });
        }
      } catch (e) {
        console.error({ e });

        if (e.message.includes("network error")) {
          this.NotifyInfo({
            msg: `Parece que você está sem internet ou com uma conexão ruim`
          });
        } else {
          this.errorMessage = "Usuário ou senha inválidos";
        }

        this.authenticating = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    width: 200px;
  }

  input,
  label,
  button {
    display: block;
  }

  label,
  button {
    margin: 10px 0 0;
  }

  .error-message {
    color: red;
    font-size: 14px;
  }
}
</style>
