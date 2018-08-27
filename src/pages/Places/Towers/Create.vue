<template>
  <div>
    <div v-if="towerCreated">
      <p class="text-success">
        <i class="ti-check"></i>
        Torre cadastrada com sucesso
      </p>
      <p-button class="mg-rg-sm" type="info" round @click.native.prevent="resetForm">
        Cadastrar outra
      </p-button>
      <a href="#" class="back-link" @click.prevent="onGoBack">
        Voltar para a listagem
      </a>
    </div>
    <div v-if="!towerCreated">
      <a href="#" class="back-link" @click.prevent="onGoBack">
        <i class="ti-arrow-left"></i> Voltar
      </a>
      <form @submit.prevent="onFormSubmit">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <h4>Cliente</h4>
              <div v-if="gettingOwnerData" class="ss-inline-spinner"></div>
              <h6 v-else>{{ owner.name }}</h6>

              <h4>Local</h4>
              <div v-if="gettingPlaceData" class="ss-inline-spinner"></div>
              <h6 v-else>{{ place.name }}</h6>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h4>Informações da Torre</h4>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <ss-fg-input :class="{'has-error': $v.tower.name.$error}" @input="delayTouch($v.tower.name)" type="text" label="Nome" placeholder="Nome" v-model.trim="tower.name"></ss-fg-input>
            <ul class="field-error-message" v-if="$v.tower.name.$error">
              <li v-if="!$v.tower.name.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.name.minLength">
                Nome precisa ter no mínimo {{ $v.tower.name.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <ss-fg-input :class="{'has-error': $v.tower.culture.$error}" @input="delayTouch($v.tower.culture)" type="text" label="Cultura" placeholder="Cultura" v-model.trim="tower.culture"></ss-fg-input>
            <ul class="field-error-message" v-if="$v.tower.culture.$error">
              <li v-if="!$v.tower.culture.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.culture.minLength">
                Cultura precisa ter no mínimo {{ $v.tower.culture.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <ss-fg-input :spinner="searchingPostalCode" :class="{'has-error': $v.tower.postalCode.$error}" @input="delayTouch($v.tower.postalCode)" type="text" v-mask="'#####-###'" maxlength="9" label="CEP" placeholder="CEP" v-model.trim="tower.postalCode"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.tower.postalCode.$error">
              <li v-if="!$v.tower.postalCode.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.postalCode.isValid ">
                Esse CEP não é válido
              </li>
            </ul>
          </div>

          <div class="col-md-8">
            <ss-fg-input :class="{'has-error': $v.tower.district.$error}" @input="delayTouch($v.tower.district)" type="text" label="Bairro" placeholder="Bairro" v-model.trim="tower.district">
            </ss-fg-input>
            <ul class="field-error-message " v-if="$v.tower.district.$error">
              <li v-if="!$v.tower.district.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.district.minLength ">
                Bairro precisa ter no mínimo {{ $v.tower.district.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-10">
            <ss-fg-input :class="{'has-error': $v.tower.city.$error}" @input="delayTouch($v.tower.city)" type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="tower.city"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.tower.city.$error">
              <li v-if="!$v.tower.city.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.city.minLength ">
                Cidade precisa ter no mínimo {{ $v.tower.city.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>

          <div class="col-md-2">
            <ss-fg-input :uppercase="true" :class="{'has-error': $v.tower.estate.$error}" @input="delayTouch($v.tower.estate)" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="tower.estate"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.tower.estate.$error">
              <li v-if="!$v.tower.estate.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.estate.minLength || !$v.tower.estate.maxLength">
                UF precisa ter {{ $v.tower.estate.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <ss-fg-input :class="{'has-error': $v.tower.address.$error}" @input="delayTouch($v.tower.address)" maxlength="100" type="text" label="Endereço" placeholder="Endereço" v-model.trim="tower.address"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.tower.address.$error">
              <li v-if="!$v.tower.address.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.address.minLength ">
                Endereço precisa ter no mínimo {{ $v.tower.address.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>

          <div class="col-md-4">
            <ss-fg-input :class="{'has-error': $v.tower.number.$error}" @input="delayTouch($v.tower.number)" type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="tower.number"></ss-fg-input>
            <ul class="field-error-message " v-if="$v.tower.number.$error">
              <li v-if="!$v.tower.number.required">
                Campo requerido
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center ">
          <p-button type="info" nativeType="submit" :disabled="$v.$invalid || creatingTower" round>
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
import basePage from "../../../mixins/BasePage.js";

const touchMap = new WeakMap();

export default {
  directives: { mask },
  mixins: [validationMixin, basePage],
  data() {
    return {
      place: {
        id: "",
        name: ""
      },
      tower: {
        name: "",
        culture: "",
        lat: "",
        lng: ""
      },
      owner: {
        id: "",
        name: "",
        placesList: []
      },
      gettingPlaceData: true,
      gettingOwnerData: true,
      buttonText: "Cadastrar torre",
      creatingTower: false,
      towerCreated: false
    };
  },
  validations: {
    tower: {
      name: {
        required,
        minLength: minLength(3)
      },
      culture: {
        required,
        minLength: minLength(2)
      },
      lat: {
        required
      },
      lng: {
        required
      }
    }
  },
  created() {
    const getPlaceData = placeId => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .get()
          .then(doc => {
            resolve(Object.assign(doc.data(), { id: doc.id }));
          });
      });
    };

    const getOwnerData = ownerId => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("users_profile")
          .doc(ownerId)
          .get()
          .then(doc => {
            resolve(Object.assign(doc.data(), { id: doc.id }));
          });
      });
    };

    getPlaceData(this.$route.params.placeId).then(data => {
      this.gettingPlaceData = false;
      this.place.id = data.id;
      this.place.name = data.name;

      getOwnerData(data.owner).then(data => {
        this.gettingOwnerData = false;
        this.owner.id = data.id;
        this.owner.name = data.name;
      });
    });

    getOwnerData().then(ownerData => {
      this.owner.id = ownerData.id;
      this.owner.name = ownerData.name;
    });
  },
  methods: {
    onGoBack() {
      this.$router.push("../list");
    },
    delayTouch($v) {
      $v.$reset();

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    onFormSubmit() {
      this.buttonText = "Cadastrando torre...";
      this.creatingTower = true;
      this.$v.$touch();

      const newTower = {
        name: this.tower.name,
        culture: this.tower.culture,
        geolocation: {
          lat: "",
          lng: ""
        },
        last_data: {
          date: 0,
          environmentTemperature: 0,
          environmentHumidity: 0,
          groundTemperature: 0,
          groundHumidity: 0
        },
        status: "online",
        disabled: false
      };

      firebase
        .firestore()
        .collection("places")
        .doc(this.place.id)
        .collection("towers")
        .add(newTower)
        .then(doc => {
          this.towerCreated = true;
        })
        .catch(e => {
          console.log(`tower couldn't be created ${e}`);
          this.buttonText = "Cadastrar torre";
          this.creatingTower = false;

          this.notifyVue(
            "bottom",
            "right",
            "danger",
            "A torre não pode ser criada: erro desconhecido",
            "ti-thumb-down"
          );
        });
    },
    resetForm() {
      this.tower.name = "";
      this.tower.culture = "";
      this.tower.address = "";
      this.tower.city = "";
      this.tower.estate = "";
      this.tower.district = "";
      this.tower.number = "";
      this.tower.postalCode = "";

      this.buttonText = "Cadastrar local";
      this.creatingTower = false;
      this.towerCreated = false;

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
