<template>
  <div class="form-wrapper">
    <div v-if="loading">Autenticando...</div>
    <form v-if="!loading" @submit="onLogin">
      <h1>Login</h1>
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
      loading: false
    };
  },
  methods: {
    onLogin() {
      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$router.replace("/dashboard");
          },
          err => {
            this.loading = false;
            alert(`Oops ${err.message}`);
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
}
</style>
