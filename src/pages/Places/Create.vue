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
              <select id="owner" class="form-control" v-model="owner" :class="{'has-error': $v.owner.$error}">
                <option disabled value="">Selecione um cliente</option>
                <option v-for="client in clients" :key="client.id" v-bind:value="client.id">
                  {{ client.name }}
                </option>
              </select>
              <ul class="field-error-message" v-if="$v.owner.$error">
                <li v-if="!$v.owner.required">
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
        </div>

        <div class="row">
          <div class="col-md-8">
            <ss-fg-input :class="{'has-error': $v.city.$error}" @input="delayTouch($v.city)" type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="city">
            </ss-fg-input>
            <ul class="field-error-message " v-if="$v.city.$error">
              <li v-if="!$v.city.required">
                Campo requerido
              </li>
              <li v-if="!$v.city.minLength ">
                Cidade precisa ter no mínimo {{ $v.city.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
          <div class="col-md-4">
            <ss-fg-input :uppercase="true" :class="{'has-error': $v.estate.$error}" @input="delayTouch($v.estate)" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="estate">
            </ss-fg-input>
            <ul class="field-error-message " v-if="$v.estate.$error">
              <li v-if="!$v.estate.required">
                Campo requerido
              </li>
              <li v-if="!$v.estate.minLength || !$v.estate.maxLength">
                UF precisa ter {{ $v.estate.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>
        <div class="text-center ">
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
import basePage from "../../mixins/BasePage.js";

const touchMap = new WeakMap();

export default {
  mixins: [validationMixin, basePage],
  data() {
    return {
      clients: [],
      name: "",
      city: "",
      estate: "",
      owner: "",
      buttonText: "Cadastrar local",
      creatingPlace: false,
      placeCreated: false
    };
  },
  validations: {
    owner: {
      required
    },
    name: {
      required,
      minLength: minLength(3)
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
      this.owner = this.$route.query.clientId;
    });
  },
  methods: {
    onGoBack() {
      this.$router.replace(`list?clientId=${this.owner}`);
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
        name: this.name,
        owner: this.owner,
        city: this.city,
        estate: this.estate.toUpperCase(),
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
      this.name = "";
      this.city = "";
      this.estate = "";
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
