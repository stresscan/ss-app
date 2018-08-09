<template>
  <card class="card" title="Novo Usuário">
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-6">
            <fg-input type="text" label="Nome" placeholder="Nome" v-model="user.name">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="text" label="Sobrenome" placeholder="Sobrenome" v-model="user.surname">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <fg-input type="email" label="Email" placeholder="Email" v-model="user.email">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text" label="Username" placeholder="Username" v-model="user.username">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input type="password" label="Senha" placeholder="Senha" v-model="user.password">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="password" label="Confirme a Senha" placeholder="Confirme a Senha" v-model="user.confirmPassword">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input type="number" label="CEP" placeholder="CEP" v-model="user.postalCode">
            </fg-input>
          </div>
          <div class="col-md-8">
            <fg-input type="text" label="Endereço" placeholder="Endereço" v-model="user.address">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input type="text" label="Cidade" placeholder="Cidade" v-model="user.city">
            </fg-input>
          </div>
          <div class="col-md-2">
            <fg-input type="text" label="UF" placeholder="UF" v-model="user.estate">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text" label="Telefone" placeholder="Telefone" v-model="user.phoneNumber">
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info" round @click.native.prevent="onCreateUser">
            Criar Usuário
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>
<script>
import firebase from "firebase";

export default {
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        name: "",
        surname: "",
        address: "",
        city: "",
        estate: "",
        postalCode: "",
        isAdmin: false
      }
    };
  },
  methods: {
    onGoBack() {
      this.$router.replace("list");
    },
    onCreateUser() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.user.username
            })
            .then(() => console.log("displayName updated"))
            .catch(e => console.log(`displayname couldn't be updated ${e}`));

          firebase
            .firestore()
            .collection("users_profile")
            .doc(createdUser.user.uid)
            .set({
              name: this.user.name,
              surname: this.user.surname,
              username: this.user.username,
              address: this.user.address,
              city: this.user.city,
              estate: this.user.estate,
              postalCode: this.user.postalCode,
              isAdmin: this.user.isAdmin
            })
            .then(() => console.log("user profile created"))
            .catch(e => console.log(`user profile couldn't be created ${e}`));
        })
        .catch(e => console.log(`user couldn't be created ${e}`));
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
