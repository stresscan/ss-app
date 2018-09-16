<template>
  <div class="form-wrapper">
    <div v-if="loading">Carregando...</div>
    <div v-if="authenticating">Autenticando...</div>
    <form v-if="!loading && !authenticating" @submit.prevent="onLogin">
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
import firebase from "firebase";
import { mapActions } from "vuex";

export default {
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
    const getUser = () => {
      return new Promise(resolve => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            resolve(user);
          } else {
            resolve(null);
          }
        });
      });
    };

    const user = await getUser();
    if (user) {
      firebase
        .firestore()
        .collection("users_profile")
        .doc(user.uid)
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            this.updateUserLevel(docSnapshot.data().isAdmin);
            this.updateUsername(docSnapshot.data().username);
            this.updateUID(docSnapshot.id);
            this.updatePushNotificationsEnable(
              docSnapshot.data().push_notifications_enable
            );
            this.$router.replace("/dashboard");
          } else {
            this.errorMessage = "Perfil de usuário não encontrado";
            this.loading = false;
          }
        });
    } else {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions([
      "updateUserLevel",
      "updateUsername",
      "updateUID",
      "updatePushNotificationsEnable"
    ]),
    onLogin() {
      this.authenticating = true;

      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          userSnapshot => {
            firebase
              .firestore()
              .collection("users_profile")
              .doc(userSnapshot.user.uid)
              .get()
              .then(docSnapshot => {
                if (docSnapshot.exists) {
                  this.updateUserLevel(docSnapshot.data().isAdmin);
                  this.updateUsername(docSnapshot.data().username);
                  this.updateUID(docSnapshot.id);
                  this.updatePushNotificationsEnable(
                    docSnapshot.data().push_notifications_enable
                  );
                  this.$router.replace("/dashboard");
                } else {
                  this.authenticating = false;
                  this.errorMessage = "Perfil de usuário não encontrado";
                }
              });
          },
          err => {
            this.authenticating = false;
            this.errorMessage = "Usuário e/ou senha inválido";
          }
        );
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
