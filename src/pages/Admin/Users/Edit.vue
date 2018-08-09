<template>
  <card class="card" title="Novo Usuário">
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-6">
            <fg-input type="text" label="Local de Trabalho" :disabled="true" placeholder="SS0" v-model="user.company">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="text" label="Username" placeholder="Username" v-model="user.username">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input type="email" label="Email" placeholder="Email" v-model="user.email">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="email" label="Telefone" placeholder="Telefone" v-model="user.phone">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input type="text" label="Nome" placeholder="Nome" v-model="user.firstName">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="text" label="Sobrenome" placeholder="Sobrenome" v-model="user.lastName">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input type="text" label="Endereço" placeholder="Endereço" v-model="user.address">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <fg-input type="text" label="Cidade" placeholder="Cidade" v-model="user.city">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="number" label="CEP" placeholder="CEP" v-model="user.postalCode">
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info" round @click.native.prevent="onUpdateProfile">
            Atualizar Dados
          </p-button>
          <a href="#" style="margin-left: 10px">Alterar minha senha</a>
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
        company: "SS0",
        username: "digofake",
        email: "rfake@ssalfa.com.br",
        phone: "18 99057-8876",
        name: "",
        lastName: "",
        address: "",
        city: "Presidente Prudente/SP",
        postalCode: ""
      }
    };
  },
  methods: {
    onGoBack() {
      this.$router.replace("list");
    },
    onUpdateProfile() {
      alert("Your data: " + JSON.stringify(this.user));
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
