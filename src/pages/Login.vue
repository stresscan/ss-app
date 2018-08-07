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
      this.$router.replace("/dashboard");
    } else {
      this.loading = false;
    }
  },
  methods: {
    onLogin() {
      this.authenticating = true;

      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$router.replace("/dashboard");
          },
          err => {
            this.authenticating = false;
            this.errorMessage = `Oops ${err.message}`;
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
