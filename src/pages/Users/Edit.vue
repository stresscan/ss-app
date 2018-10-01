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
              <select class="form-control" v-model="user.isAdmin">
                <option value="false">Cliente</option>
                <option value="true">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Nome" placeholder="Nome" v-model.trim="user.name"></ss-fg-input>
          </div>
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Sobrenome" placeholder="Sobrenome" v-model.trim="user.surname"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <ss-fg-input readonly type="email" label="Email" placeholder="Email" v-model.trim="user.email"></ss-fg-input>
          </div>
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Username" placeholder="Username" v-model.trim="user.username"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="CEP" placeholder="CEP" v-model.trim="user.postalCode"></ss-fg-input>
          </div>
          <div class="col-md-8">
            <ss-fg-input readonly type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="user.city"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input readonly :uppercase="true" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="user.estate"></ss-fg-input>
          </div>
          <div class="col-md-6">
            <ss-fg-input readonly type="text" label="Endereço" placeholder="Endereço" v-model.trim="user.address"></ss-fg-input>
          </div>
          <div class="col-md-2">
            <ss-fg-input readonly type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="user.number"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="Bairro" placeholder="Bairro" v-model.trim="user.district"></ss-fg-input>
          </div>
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="Telefone" placeholder="Telefone" v-model.trim="user.phoneNumber"></ss-fg-input>
          </div>
          <div class="col-md-4">
            <ss-fg-input readonly type="text" label="Telefone 2" placeholder="Telefone 2" v-model.trim="user.phoneNumberTwo"></ss-fg-input>
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
import { notifyMixin } from "@/mixins/Notify";
import basicPageMixin from "@/mixins/BasicPage";
import usersProfileService from "@/services/UsersProfileService";

export default {
  mixins: [basicPageMixin, notifyMixin],
  data() {
    return {
      user: {
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
        isAdmin: false
      },
      searchingPostalCode: false,
      checkingEmail: false,
      checkingUsername: false,
      buttonText: "Editar usuário",
      editingUser: false
    };
  },
  async created() {
    try {
      this.user = await usersProfileService.get(this.$route.params.id);
    } catch (e) {
      console.log(`user profile couldn't be find ${e}`);
      this.notifyError({
        msg: `O perfil do usuário não pode ser recuperado: erro inesperado`
      });
    }
  },
  methods: {
    onGoBack() {
      this.$router.replace("list");
    },
    async onEditUser() {
      this.buttonText = "Editando usuário...";
      this.editingUser = true;

      try {
        await usersProfileService.update({
          id: this.$route.params.id,
          isAdmin: this.isAdmin
        });

        this.$router.replace("list?edited=1");
      } catch (e) {
        console.error(`user couldn't be updated ${e}`);
        this.notifyError({
          msg: `O usuário não pode ser atualizado: erro inesperado`
        });

        this.buttonText = "Editar usuário";
        this.editingUser = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
