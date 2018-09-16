<template>
  <div>
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <card class="card" title="Novo Usuário">
      <div>
        <form @submit.prevent="onFormSubmit">
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
              <ss-fg-input :class="{'has-error': $v.name.$error}" @input="delayTouch($v.name)" type="text" label="Nome" placeholder="Nome" v-model.trim="name"></ss-fg-input>
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
              <ss-fg-input :class="{'has-error': $v.surname.$error}" @input="delayTouch($v.surname)" type="text" label="Sobrenome" placeholder="Sobrenome" v-model.trim="surname"></ss-fg-input>
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
            <div class="col-md-6">
              <ss-fg-input :spinner="checkingEmail" maxlength="200" :class="{'has-error': $v.email.$error}" @input="delayTouch($v.email)" type="email" label="Email" placeholder="Email" v-model.trim="email">
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
            <div class="col-md-6">
              <ss-fg-input :spinner="checkingUsername" maxlength="50" :class="{'has-error': $v.username.$error}" @input="delayTouch($v.username)" type="text" label="Username" placeholder="Username" v-model.trim="username">
              </ss-fg-input>
              <ul class="field-error-message" v-if="$v.username.$error">
                <li v-if="!$v.username.required">
                  Campo requerido
                </li>
                <li v-if="!$v.username.minLength">
                  Username precisa ter no mínimo {{ $v.username.$params.minLength.min }} caracteres
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
              <ss-fg-input :spinner="searchingPostalCode" :class="{'has-error': $v.postalCode.$error}" @input="delayTouch($v.postalCode)" type="text" v-mask="'#####-###'" maxlength="9" label="CEP" placeholder="CEP" v-model.trim="postalCode">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.postalCode.$error">
                <li v-if="!$v.postalCode.isValid ">
                  Esse CEP não é válido
                </li>
              </ul>
            </div>

            <div class="col-md-8">
              <ss-fg-input :class="{'has-error': $v.city.$error}" @input="delayTouch($v.city)" type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="city">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.city.$error">
                <li v-if="!$v.city.minLength ">
                  Cidade precisa ter no mínimo {{ $v.city.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <ss-fg-input :uppercase="true" :class="{'has-error': $v.estate.$error}" @input="delayTouch($v.estate)" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="estate">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.estate.$error">
                <li v-if="!$v.estate.minLength || !$v.estate.maxLength">
                  UF precisa ter {{ $v.estate.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <ss-fg-input :class="{'has-error': $v.address.$error}" @input="delayTouch($v.address)" maxlength="100" type="text" label="Endereço" placeholder="Endereço" v-model.trim="address"></ss-fg-input>
              <ul class="field-error-message " v-if="$v.address.$error">
                <li v-if="!$v.address.minLength ">
                  Endereço precisa ter no mínimo {{ $v.address.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
            <div class="col-md-2">
              <ss-fg-input type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="number"></ss-fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <ss-fg-input :class="{'has-error': $v.district.$error}" @input="delayTouch($v.district)" type="text" label="Bairro" placeholder="Bairro" v-model.trim="district">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.district.$error">
                <li v-if="!$v.district.minLength ">
                  Bairro precisa ter no mínimo {{ $v.district.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <ss-fg-input type="text" label="Telefone" v-mask="'(##) #####-####'" placeholder="Telefone" v-model.trim="phoneNumber">
              </ss-fg-input>
            </div>
            <div class="col-md-4">
              <ss-fg-input type="text" label="Telefone 2" v-mask="'(##) #####-####'" placeholder="Telefone 2" v-model.trim="phoneNumberTwo">
              </ss-fg-input>
            </div>
          </div>

          <div class="text-center ">
            <p-button type="info" nativeType="submit" :disabled="$v.$invalid || creatingUser" round>
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
  </div>
</template>
<script>
import firebase from "firebase";
import {
  email,
  required,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import axios from "axios";
import { mask } from "vue-the-mask";
import basePage from "@/mixins/BasePage.js";
import { mapState } from "vuex";
import logService from "@/services/LogService.js";

const touchMap = new WeakMap();

export default {
  directives: { mask },
  mixins: [validationMixin, basePage],
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
      buttonText: "Criar usuário",
      creatingUser: false
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
        this.checkingUsername = true;

        if (value === "") {
          this.checkingUsername = false;
          return true;
        }

        return new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("users_profile")
            .where("username", "==", value)
            .get()
            .then(querySnapshot => {
              this.checkingUsername = false;
              resolve(querySnapshot.empty);
            });
        });
      }
    },
    email: {
      required,
      email,
      isUnique(value) {
        this.checkingEmail = true;

        if (value === "") {
          this.checkingEmail = false;
          return true;
        }
        return new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("users_profile")
            .where("email", "==", value)
            .get()
            .then(querySnapshot => {
              this.checkingEmail = false;
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
    },
    postalCode: {
      isValid(value) {
        if (value === "") return true;
        return new Promise((resolve, reject) => {
          this.address = "";
          this.city = "";
          this.estate = "";
          this.district = "";
          this.searchingPostalCode = true;

          axios.get(`https://viacep.com.br/ws/${this.postalCode}/json/`).then(
            address => {
              if (address.data.erro) {
                this.searchingPostalCode = false;
                resolve(false);
              }

              this.address = address.data.logradouro;
              this.city = address.data.localidade;
              this.estate = address.data.uf;
              this.district = address.data.bairro;
              this.searchingPostalCode = false;
              resolve(true);
            },
            e => {
              this.searchingPostalCode = false;
              resolve(false);
            }
          );
        });
      }
    },
    city: {
      minLength: minLength(4)
    },
    estate: {
      minLength: minLength(2),
      maxLength: maxLength(2)
    },
    address: {
      minLength: minLength(4)
    },
    district: {
      minLength: minLength(4)
    }
  },
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid
    })
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
    onFormSubmit() {
      this.buttonText = "Criando usuário...";
      this.creatingUser = true;
      this.$v.$touch();

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: this.username
            })
            .catch(e => {
              console.log(`displayname couldn't be updated ${e}`);
              logService.logError(
                new Date().getTime(),
                `displayname couldn't be updated (fail or catch): ${e.message}`,
                "createUser",
                "update displayName",
                this.stateUid
              );
            });

          const newUser = {
            date: Date.now(),
            name: this.name,
            surname: this.surname,
            email: this.email,
            username: this.username,
            postalCode: this.postalCode,
            city: this.city,
            estate: this.estate.toUpperCase(),
            address: this.address,
            number: this.number,
            district: this.district,
            phoneNumber: this.phoneNumber,
            phoneNumber: this.phoneNumber,
            phoneNumberTwo: this.phoneNumberTwo,
            isAdmin: Boolean(Number(this.isAdmin)),
            push_notifications_tokens: [],
            push_notifications_enable: false
          };

          firebase
            .firestore()
            .collection("users_profile")
            .doc(createdUser.user.uid)
            .set(newUser)
            .then(
              () => {
                this.$router.replace("list?created=1");
              },
              e => {
                this.buttonText = "Criar usuário";
                this.creatingUser = false;

                this.notifyVue(
                  "bottom",
                  "right",
                  "danger",
                  "O perfil do usuário não pode ser criado: erro desconhecido",
                  "ti-thumb-down"
                );

                logService.logError(
                  new Date().getTime(),
                  `create user profile fail: ${e.message}`,
                  "createUser",
                  "create user profile",
                  this.stateUid
                );
              }
            );
        })
        .catch(e => {
          this.buttonText = "Criar usuário";
          this.creatingUser = false;

          this.notifyVue(
            "bottom",
            "right",
            "danger",
            "O usuário não pode ser criado: erro inesperado",
            "ti-thumb-down"
          );

          logService.logError(
            new Date().getTime(),
            `user account create fail or catch: ${e.message}`,
            "createUser",
            "create user account",
            this.stateUid
          );
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
