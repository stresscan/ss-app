<template>
  <card class="card" title="Editar Usuário">
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="control-label" for="isAdmin">Nível</label>
              <select class="form-control" v-model="isAdmin">
                <option value="0">Cliente</option>
                <option value="1">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Nome" placeholder="Nome" v-model.trim="name">
            </ss-fg-input>
          </div>
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Sobrenome" placeholder="Sobrenome" v-model.trim="surname">
            </ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <ss-fg-input readonly type="email" label="Email" placeholder="Email" v-model.trim="email">
            </ss-fg-input>
          </div>
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Username" placeholder="Username" v-model.trim="username">
            </ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="CEP" placeholder="CEP" v-model.trim="postalCode">
            </ss-fg-input>
          </div>
          <div class="col-md-8">
            <ss-fg-input readonly type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="city">
            </ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input readonly :uppercase="true" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="estate">
            </ss-fg-input>
          </div>
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Endereço" placeholder="Endereço" v-model.trim="address">
            </ss-fg-input>
          </div>
          <div class="col-md-2">
            <ss-fg-input readonly type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="number">
            </ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="Bairro" placeholder="Bairro" v-model.trim="district">
            </ss-fg-input>
          </div>
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="Telefone" placeholder="Telefone" v-model.trim="phoneNumber">
            </ss-fg-input>
          </div>
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="Telefone 2" placeholder="Telefone 2" v-model.trim="phoneNumberTwo">
            </ss-fg-input>
          </div>
        </div>

        <div class="text-center ">
          <p-button type="info" :disabled="editingUser" round @click.native.prevent="onEditUser">
            {{ buttonText }}
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
  </card>
</template>
<script>
import firebase from "firebase";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      phoneNumber: "",
      phoneNumberTwo: "",
      name: "",
      surname: "",
      address: "",
      city: "",
      district: "",
      number: "",
      estate: "",
      postalCode: "",
      searchingPostalCode: false,
      checkingEmail: false,
      checkingUsername: false,
      isAdmin: 0,
      buttonText: "Editar usuário",
      editingUser: false
    };
  },
  created() {
    firebase
      .firestore()
      .collection("users_profile")
      .doc(this.$route.params.id)
      .get()
      .then(userSnapShot => {
        this.name = userSnapShot.data().name;
        this.surname = userSnapShot.data().surname;
        this.email = userSnapShot.data().email;
        this.username = userSnapShot.data().username;
        this.postalCode = userSnapShot.data().postalCode;
        this.city = userSnapShot.data().city;
        this.estate = userSnapShot.data().estate;
        this.address = userSnapShot.data().address;
        this.number = userSnapShot.data().number;
        this.district = userSnapShot.data().district;
        this.phoneNumber = userSnapShot.data().phoneNumber;
        this.phoneNumber = userSnapShot.data().phoneNumber;
        this.phoneNumberTwo = userSnapShot.data().phoneNumberTwo;
        this.isAdmin = Number(userSnapShot.data().isAdmin);
      })
      .catch(e => {
        console.log(`user profile couldn't be find ${e}`);
        this.notifyVue(
          "bottom",
          "right",
          "danger",
          "O perfil do usuário não pode ser encontrado: erro inesperado",
          "ti-thumb-down"
        );
      });
  },
  methods: {
    onGoBack() {
      this.$router.replace("list");
    },
    onEditUser() {
      this.buttonText = "Editando usuário...";
      this.editingUser = true;

      firebase
        .firestore()
        .collection("users_profile")
        .doc(this.$route.params.id)
        .update({ isAdmin: Boolean(Number(this.isAdmin)) })
        .then(() => {
          this.$router.replace("list?edited=1");
        })
        .catch(e => {
          console.log(`user couldn't be updated ${e}`);
          this.notifyVue(
            "bottom",
            "right",
            "danger",
            "O usuário não pode ser atualizado: erro inesperado",
            "ti-thumb-down"
          );

          this.buttonText = "Editar usuário...";
          this.editingUser = false;
        });
    },
    notifyVue(verticalAlign, horizontalAlign, type, message, icon) {
      this.$notify({
        message,
        icon,
        horizontalAlign,
        verticalAlign,
        type
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
