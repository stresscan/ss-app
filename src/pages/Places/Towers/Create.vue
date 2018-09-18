<template>
  <div>
    <div v-if="towerCreated">
      <p class="text-success">
        <i class="ti-check mg-rg-xxs"></i>
        <b>Torre cadastrada com sucesso</b>
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
              <h6 v-else>{{ place.owner.name }}</h6>

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
          <div class="col-md-6">
            <ss-fg-input :class="{'has-error': $v.tower.id.$error}" @input="delayTouch($v.tower.id)" type="text" label="Código da Torre" placeholder="Código da Torre" v-model.trim="tower.id"></ss-fg-input>
            <ul class="field-error-message" v-if="$v.tower.id.$error">
              <li v-if="!$v.tower.id.required">
                Campo requerido
              </li>
              <li v-if="!$v.tower.id.minLength">
                Código da Torre precisa ter no mínimo {{ $v.tower.id.$params.minLength.min }} caracteres
              </li>
            </ul>
          </div>

          <div class="col-md-6">
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
            <ss-fg-input type="text" readonly label="CEP" placeholder="CEP" v-model.trim="place.location.postalCode"></ss-fg-input>
          </div>

          <div class="col-md-8">
            <ss-fg-input readonly type="text" label="Bairro" placeholder="Bairro" v-model.trim="place.location.district"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-10">
            <ss-fg-input readonly type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="place.location.city"></ss-fg-input>
          </div>

          <div class="col-md-2">
            <ss-fg-input :uppercase="true" readonly type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="place.location.estate"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <ss-fg-input readonly maxlength="100" type="text" label="Endereço" placeholder="Endereço" v-model.trim="place.location.address"></ss-fg-input>
          </div>

          <div class="col-md-4">
            <ss-fg-input readonly type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="place.location.number"></ss-fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <h4>Localização Geográfica</h4>
            <div v-if="gettingLatLng" class="ss-inline-spinner"></div>
            <template v-else>
              <input class="d-none" type="text" v-model="tower.geolocation.lat">
              <input class="d-none" type="text" v-model="tower.geolocation.lng">
              <LocationMap class="geolocation-map" :zoom="16" :title="tower.name" :draggable="true" @dragend="onMapDragEnd" :lat="tower.geolocation.lat" :lng="tower.geolocation.lng" />
            </template>
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import axios from "axios";
import { mask } from "vue-the-mask";
import basePage from "@/mixins/BasePage.js";
import { LocationMap } from "@/components/index";

const touchMap = new WeakMap();

export default {
  directives: { mask },
  mixins: [validationMixin, basePage],
  components: {
    LocationMap
  },
  data() {
    return {
      place: {
        id: "",
        name: "",
        location: {
          postalCode: "",
          city: "",
          estate: "",
          address: "",
          number: "",
          district: ""
        },
        owner: {
          id: "",
          name: "",
          placesList: []
        }
      },
      tower: {
        id: "",
        name: "",
        culture: "",
        geolocation: {
          lat: "",
          lng: ""
        }
      },
      gettingPlaceData: true,
      gettingOwnerData: true,
      buttonText: "Cadastrar torre",
      creatingTower: false,
      towerCreated: false,
      gettingLatLng: true
    };
  },
  validations: {
    tower: {
      id: {
        required,
        minLength: minLength(3)
      },
      name: {
        required,
        minLength: minLength(3)
      },
      culture: {
        required,
        minLength: minLength(2)
      },
      geolocation: {
        lat: {
          required
        },
        lng: {
          required
        }
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

    const getAddressLatLng = location => {
      const gMapsKey = "AIzaSyAamVCoyQ4AuvBpxVRMs9P-HFkfPVQj0Kw";
      const address = `${location.postalCode},${location.address.replace(
        " ",
        "+"
      )},+${location.number.replace(" ", "+")},+${location.district.replace(
        " ",
        "+"
      )},+${location.city.replace(" ", "+")},+${location.estate.replace(
        " ",
        "+"
      )}`;

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${gMapsKey}`;

      return new Promise((resolve, reject) => {
        axios.get(url).then(geolocation => {
          if (geolocation.data.status === "OK") {
            resolve(geolocation);
          } else {
            reject(new Error(geolocation.data.status));
          }
        });
      });
    };

    getPlaceData(this.$route.params.placeId).then(data => {
      this.gettingPlaceData = false;
      this.place = data;

      getOwnerData(data.owner).then(ownerData => {
        this.gettingOwnerData = false;
        this.place.owner = ownerData;
      });

      getAddressLatLng(data.location).then(
        geolocation => {
          this.tower.geolocation.lat = String(
            geolocation.data.results[0].geometry.location.lat
          );
          this.tower.geolocation.lng = String(
            geolocation.data.results[0].geometry.location.lng
          );

          this.gettingLatLng = false;
        },
        e => console.log(e)
      );
    });
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
    onMapDragEnd(latlng) {
      this.tower.geolocation.lat = String(latlng.lat);
      this.tower.geolocation.lng = String(latlng.lng);
    },
    onFormSubmit() {
      this.buttonText = "Cadastrando torre...";
      this.creatingTower = true;
      this.$v.$touch();

      const newTower = {
        date: Date.now(),
        name: this.tower.name,
        culture: this.tower.culture,
        geolocation: {
          lat: this.tower.geolocation.lat,
          lng: this.tower.geolocation.lng
        },
        disabled: false
      };

      firebase
        .firestore()
        .collection("places")
        .doc(this.place.id)
        .collection("towers")
        .doc(this.tower.id)
        .set(newTower)
        .then(() => {
          this.towerCreated = true;

          firebase
            .firestore()
            .collection("places")
            .doc(this.place.id)
            .collection("towers")
            .doc(this.tower.id)
            .collection("stats")
            .add({
              datetime: 0,
              environment_temperature: 0,
              environment_humidity: 0,
              ground_temperature: 0,
              ground_humidity: 0
            });
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
      this.tower.id = "";
      this.tower.name = "";
      this.tower.culture = "";
      this.tower.geolocation.lat = 0;
      this.tower.geolocation.lng = 0;

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
.geolocation-map .map {
  padding-top: 0;
}
</style>
