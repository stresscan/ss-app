<template>
  <div class="form-wrapper">
    <form>
      <h1>Cadastro</h1>
      <label for="email">email</label>
      <input type="email" id="email">
      <label for="pwd">Senha</label>
      <input type="password" id="pwd">
      <button type="submit">Cadastrar</button>
      <router-link to="login">Voltar para login</router-link>
    </form>
  </div>
</template>

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
