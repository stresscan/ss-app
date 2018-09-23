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
          console.log({ onAuthStateChanged_user: user });

          if (user) {
            firebase
              .firestore()
              .collection("users_profile")
              .doc(user.uid)
              .get()
              .then(docSnapshot => {
                const currentUser = Object.assign(docSnapshot.data(), {
                  id: docSnapshot.id
                });

                localStorage.setItem("offlineCurrentUser_id", currentUser.id);
                localStorage.setItem(
                  "offlineCurrentUser_username",
                  currentUser.username
                );
                localStorage.setItem(
                  "offlineCurrentUser_isAdmin",
                  currentUser.isAdmin
                );
                localStorage.setItem(
                  "offlineCurrentUser_push_notifications_enable",
                  currentUser.push_notifications_enable
                );

                resolve(currentUser);
              })
              .catch(err => {
                if (localStorage.getItem("offlineCurrentUser_id")) {
                  resolve({
                    id: localStorage.getItem("offlineCurrentUser_id"),
                    username: localStorage.getItem(
                      "offlineCurrentUser_username"
                    ),
                    isAdmin: localStorage.getItem("offlineCurrentUser_isAdmin"),
                    push_notifications_enable: localStorage.getItem(
                      "offlineCurrentUser_push_notifications_enable"
                    )
                  });
                } else {
                  resolve(null);
                }
              });
          } else {
            resolve(null);
          }
        });
      });
    };

    const user = await getUser();

    console.log({ loginPage_user: user });

    if (user) {
      this.updateUserLevel(user.isAdmin);
      this.updateUsername(user.username);
      this.updateUID(user.id);
      this.updatePushNotificationsEnable(user.push_notifications_enable);
      this.$router.replace("/dashboard");
    } else {
      console.error("Perfil de usuário não encontrado");
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
            if (err.message.includes("network error")) {
              this.$notify({
                message:
                  "Parece que você está sem internet ou com uma conexão ruim",
                icon: "ti-thumb-down",
                verticalAlign: "bottom",
                horizontalAlign: "center",
                type: "info"
              });
            } else {
              this.errorMessage = "Usuário ou senha inválidos";
            }

            this.authenticating = false;
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
