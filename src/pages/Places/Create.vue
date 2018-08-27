<template>
  <div>
    <div v-if="placeCreated">
      <p class="text-success">
        <i class="ti-check"></i>
        Local cadastrado com sucesso
      </p>
      <p-button class="mg-rg-sm" type="info" round @click.native.prevent="resetForm">
        Cadastrar outro
      </p-button>
      <a href="#" class="back-link" @click.prevent="onGoBack">
        Voltar para a listagem
      </a>
    </div>
    <div v-if="!placeCreated">
      <a href="#" class="back-link" @click.prevent="onGoBack">
        <i class="ti-arrow-left"></i> Voltar
      </a>
      <form @submit.prevent="onFormSubmit">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <h4>
                <label class="control-label" for="owner">Cliente</label>
              </h4>
              <select id="owner" class="form-control" v-model="place.owner" :class="{'has-error': $v.place.owner.$error}">
                <option disabled value="">Selecione um cliente</option>
                <option v-for="client in clients" :key="client.id" v-bind:value="client.id">
                  {{ client.name }}
                </option>
              </select>
              <ul class="field-error-message" v-if="$v.place.owner.$error">
                <li v-if="!$v.place.owner.required">
                  Por favor, selecione um cliente
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h4>Informações do Local</h4>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <ss-fg-input :class="{'has-error': $v.place.name.$error}" @input="delayTouch($v.place.name)" type="text" label="Nome" placeholder="Nome" v-model.trim="place.name">
            </ss-fg-input>
            <ul class="field-error-message" v-if="$v.place.name.$error">
              <li v-if="!$v.place.name.required">
                Campo requerido
              </li>
              <li v-if="!$v.place.name.minLength">
                Nome precisa ter no mínimo {{ $v.place.name.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input :spinner="searchingPostalCode" :class="{'has-error': $v.place.postalCode.$error}" @input="delayTouch($v.place.postalCode)" type="text" v-mask="'#####-###'" maxlength="9" label="CEP" placeholder="CEP" v-model.trim="place.postalCode">
            </ss-fg-input>
            <ul class="field-error-message " v-if="$v.place.postalCode.$error">
              <li v-if="!$v.place.postalCode.required">
                Campo requerido
              </li>
              <li v-if="!$v.place.postalCode.isValid ">
                Esse CEP não é válido
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-10">
            <ss-fg-input :class="{'has-error': $v.place.city.$error}" @input="delayTouch($v.place.city)" type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="place.city"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.place.city.$error">
              <li v-if="!$v.place.city.required">
                Campo requerido
              </li>
              <li v-if="!$v.place.city.minLength ">
                Cidade precisa ter no mínimo {{ $v.place.city.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
          <div class="col-md-2">
            <ss-fg-input :uppercase="true" :class="{'has-error': $v.place.estate.$error}" @input="delayTouch($v.place.estate)" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="place.estate"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.place.estate.$error">
              <li v-if="!$v.place.estate.required">
                Campo requerido
              </li>
              <li v-if="!$v.place.estate.minLength || !$v.place.estate.maxLength">
                UF precisa ter {{ $v.place.estate.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info" nativeType="submit" :disabled="$v.$invalid || creatingPlace" round>
            {{ buttonText }}
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapState } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import axios from "axios";
import { mask } from "vue-the-mask";
import basePage from "../../mixins/BasePage.js";

const touchMap = new WeakMap();

export default {
  directives: { mask },
  mixins: [validationMixin, basePage],
  data() {
    return {
      clients: [],
      place: {
        name: "",
        postalCode: "",
        city: "",
        estate: "",
        owner: ""
      },
      buttonText: "Cadastrar local",
      creatingPlace: false,
      placeCreated: false,
      searchingPostalCode: false
    };
  },
  validations: {
    place: {
      owner: {
        required
      },
      name: {
        required,
        minLength: minLength(3)
      },
      postalCode: {
        required,
        isValid(value) {
          if (value === "") return true;
          return new Promise((resolve, reject) => {
            this.place.city = "";
            this.place.estate = "";
            this.searchingPostalCode = true;

            axios
              .get(`https://viacep.com.br/ws/${this.place.postalCode}/json/`)
              .then(
                address => {
                  if (address.data.erro) {
                    this.searchingPostalCode = false;
                    resolve(false);
                  }

                  this.place.city = address.data.localidade;
                  this.place.estate = address.data.uf;
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
        required,
        minLength: minLength(4)
      },
      estate: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(2)
      }
    }
  },
  created() {
    const getClientsList = () => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("users_profile")
          .where("isAdmin", "==", false)
          .get()
          .then(clientsQuerySnapshot => {
            let clients = [];

            clientsQuerySnapshot.forEach(clientDocSnapshot => {
              let clientData = Object.assign(clientDocSnapshot.data(), {
                id: clientDocSnapshot.id
              });

              clients.push(clientData);
            });

            resolve(clients);
          });
      });
    };

    getClientsList().then(clients => {
      this.clients = clients;
      this.place.owner = this.$route.query.clientId;
    });
  },
  methods: {
    onGoBack() {
      this.$router.replace(`list?clientId=${this.place.owner}`);
    },
    delayTouch($v) {
      $v.$reset();

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    onFormSubmit() {
      this.buttonText = "Cadastrando local...";
      this.creatingPlace = true;
      this.$v.$touch();

      const newPlace = {
        name: this.place.name,
        owner: this.place.owner,
        postalCode: this.place.postalCode,
        city: this.place.city,
        estate: this.place.estate.toUpperCase(),
        last_upload: "Aguardando sincronização",
        status: "online"
      };

      firebase
        .firestore()
        .collection("places")
        .add(newPlace)
        .then(place => {
          this.placeCreated = true;
        })
        .catch(e => {
          console.log(`place couldn't be created ${e}`);
          this.buttonText = "Cadastrar local";
          this.creatingPlace = false;
          this.notifyVue(
            "bottom",
            "right",
            "danger",
            "O local não pode ser criado: erro desconhecido",
            "ti-thumb-down"
          );
        });
    },
    resetForm() {
      this.place.name = "";
      this.place.postalCode = "";
      this.place.city = "";
      this.place.estate = "";
      this.buttonText = "Cadastrar local";
      this.creatingPlace = false;
      this.placeCreated = false;
      this.$nextTick(() => {
        this.$v.$reset();
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
<style>
</style>
