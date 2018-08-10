<template>
  <card class="card" title="Novo Usuário">
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-6">
            <ss-fg-input :class="{'has-error': $v.name.$error}" @input="delayTouch($v.name)" type="text" label="Nome" placeholder="Nome" v-model.trim="name">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.name.$error">
              <li v-if="!$v.name.required">
                Campo requerido
              </li>
              <li v-if="!$v.name.minLength">
                Nome precisa ter no mínimo {{ $v.name.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <ss-fg-input :class="{'has-error': $v.surname.$error}" @input="delayTouch($v.surname)" type="text" label="Sobrenome" placeholder="Sobrenome" v-model.trim="surname">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.surname.$error">
              <li v-if="!$v.surname.required">
                Campo requerido
              </li>
              <li v-if="!$v.surname.minLength">
                Sobrenome precisa ter no mínimo {{ $v.surname.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <ss-fg-input :class="{'has-error': $v.email.$error}" @input="delayTouch($v.email)" type="email" label="Email" placeholder="Email" v-model.trim="email">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.email.$error">
              <li v-if="!$v.email.required">
                Campo requerido
              </li>
              <li v-if="!$v.email.email">
                Esse e-mail não é um e-mail válido
              </li>
              <li v-if="!$v.email.isUnique">
                Esse e-mail já está em uso
              </li>
            </ul>
          </div>
          <div class="col-md-4">
            <ss-fg-input :class="{'has-error': $v.username.$error}" @input="delayTouch($v.username)" type="text" label="Username" placeholder="Username" v-model.trim="username">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.username.$error">
              <li v-if="!$v.username.required">
                Campo requerido
              </li>
              <li v-if="!$v.username.minLength">
                Nome precisa ter no mínimo {{ $v.username.$params.minLength.min }} caracteres
              </li>
              <li v-if="!$v.username.isUnique">
                Esse username já está em uso
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <ss-fg-input :class="{'has-error': $v.password.$error}" @input="delayTouch($v.password)" type="password" label="Senha" placeholder="Senha" v-model.trim="password">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.password.$error">
              <li v-if="!$v.password.required">
                Campo requerido
              </li>
              <li v-if="!$v.password.minLength">
                Senha precisa ter no mínimo {{ $v.password.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <ss-fg-input :class="{'has-error': $v.repeatPassword.$error}" @input="delayTouch($v.repeatPassword)" type="password" label="Confirme a Senha" placeholder="Confirme a Senha" v-model.trim="repeatPassword">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.repeatPassword.$error">
              <li v-if="!$v.repeatPassword.sameAsPassword">
                As senhas devem ser iguais
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input type="number" label="CEP" placeholder="CEP" v-model.trim="postalCode">
            </ss-fg-input>
          </div>
          <div class="col-md-8">
            <ss-fg-input type="text" label="Endereço" placeholder="Endereço" v-model="address">
            </ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <ss-fg-input type="text" label="Cidade" placeholder="Cidade" v-model="city">
            </ss-fg-input>
          </div>
          <div class="col-md-2">
            <ss-fg-input type="text" label="UF" placeholder="UF" v-model="estate">
            </ss-fg-input>
          </div>
          <div class="col-md-4">
            <ss-fg-input type="text" label="Telefone" placeholder="Telefone" v-model="phoneNumber">
            </ss-fg-input>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info" :disabled="$v.$invalid" round @click.native.prevent="onCreateUser">
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
import { email, required, minLength, sameAs } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

const touchMap = new WeakMap();

export default {
  mixins: [validationMixin],
  data() {
    return {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      phoneNumber: "",
      name: "",
      surname: "",
      address: "",
      city: "",
      estate: "",
      postalCode: "",
      isAdmin: false
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    surname: {
      required,
      minLength: minLength(4)
    },
    username: {
      required,
      minLength: minLength(4),
      isUnique(value) {
        if (value === "") return true;
        return new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("users_profile")
            .where("username", "==", value)
            .get()
            .then(querySnapshot => {
              resolve(querySnapshot.empty);
            });
        });
      }
    },
    email: {
      required,
      email,
      isUnique(value) {
        if (value === "") return true;
        return new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("users_profile")
            .where("email", "==", value)
            .get()
            .then(querySnapshot => {
              resolve(querySnapshot.empty);
            });
        });
      }
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs("password")
    }
  },
  methods: {
    onGoBack() {
      this.$router.replace("list");
    },
    delayTouch($v) {
      $v.$reset();

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    onCreateUser() {
      this.$v.$touch();

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: this.username
            })
            .then(() => console.log("displayName updated"))
            .catch(e => console.log(`displayname couldn't be updated ${e}`));

          firebase
            .firestore()
            .collection("users_profile")
            .doc(createdUser.uid)
            .set({
              name: this.name,
              surname: this.surname,
              email: this.email,
              username: this.username,
              address: this.address,
              city: this.city,
              estate: this.estate,
              postalCode: this.postalCode,
              isAdmin: this.isAdmin
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
