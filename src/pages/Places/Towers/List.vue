<template>
  <div>
    <a class="back-link" href="#" @click="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div class="row">
      <div class="col-12">
        <card>
          <div slot="raw-content" class="pd-all-md">
            <a href="#" v-if="isAdmin && !editPlace" @click.prevent="editPlace = true">
              <i class="ti-pencil "></i> Editar
            </a>

            <div v-if="loadingPlaceData" class="ss-inline-spinner el-center mg-tp-md "></div>
            <template v-else>
              <form @submit.prevent="onEditFormSubmit">
                <h3 v-if="!editPlace">{{ place.name }}</h3>
                <ss-fg-input v-else :class="{ 'has-error': $v.place.name.$error} " @input="delayTouch($v.place.name) " type="text " label="Nome " placeholder="Nome " v-model.trim="place.name "></ss-fg-input>
                <ul class="field-error-message " v-if="$v.place.name.$error ">
                  <li v-if="!$v.place.name.required ">
                    Campo requerido
                  </li>
                  <li v-if="!$v.place.name.minLength ">
                    Nome precisa ter no mínimo {{ $v.place.name.$params.minLength.min }} caracteres
                  </li>
                </ul>

                <template v-if="!editPlace">
                  <i class="ti-location-pin "></i> {{ place.city }}/{{ place.estate }}
                </template>
                <template v-else>
                  <div class="row ">
                    <div class="col-sm-10 ">
                      <ss-fg-input :class="{ 'has-error': $v.place.city.$error} " @input="delayTouch($v.place.city) " type="text " label="Cidade " placeholder="Cidade " maxlength="50 " v-model.trim="place.city "></ss-fg-input>
                      <span class="d-none d-sm-block city-estate-slash ">/</span>
                      <ul class="field-error-message " v-if="$v.place.city.$error ">
                        <li v-if="!$v.place.city.required ">
                          Campo requerido
                        </li>
                        <li v-if="!$v.place.city.minLength ">
                          Cidade precisa ter no mínimo {{ $v.place.city.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                      <ul class="field-error-message d-none d-sm-block" v-if="$v.place.estate.$error">
                        <li v-if="!$v.place.estate.required">
                          Campo UF é requerido
                        </li>
                        <li v-if="!$v.place.estate.minLength || !$v.place.estate.maxLength">
                          UF precisa ter {{ $v.place.estate.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                    </div>

                    <div class="col-sm-2">
                      <ss-fg-input :uppercase="true " :class="{ 'has-error': $v.place.estate.$error} " @input="delayTouch($v.place.estate) " type="text " label="UF " maxlength="2 " placeholder="UF " v-model.trim="place.estate "></ss-fg-input>
                      <ul class="field-error-message d-sm-none" v-if="$v.place.estate.$error">
                        <li v-if="!$v.place.estate.required">
                          Campo UF é requerido
                        </li>
                        <li v-if="!$v.place.estate.minLength || !$v.place.estate.maxLength">
                          UF precisa ter {{ $v.place.estate.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="mg-bt-md">
                    <p-button type="info" nativeType="submit" :disabled="$v.$invalid || editingPlace" round>
                      {{ editingButtonText }}
                    </p-button>
                    <a href="#" @click.prevent="editPlace = false" class="mg-lf-sm">Cancelar</a>
                  </div>
                </template>
              </form>
              <br />
              <i class="ti-signal "></i> {{ qntTowers }} torre(s)
              <div v-if="isAdmin " class="mg-tp-md ">
                <span :class="{ 'text-danger': place.disabled, 'text-success': !place.disabled} ">
                  <i class="ti-flag "></i> {{ place.disabled ? "Desativado " : "Ativado " }}
                </span>
                <a v-if="!togglingDisabled " href="# " @click.prevent="onToggleDisabled ">{{ place.disabled ? "Ativar " : "Desativar " }}</a>
                <div v-else class="ss-inline-block-spinner mg-lf-sm "></div>
              </div>
            </template>
          </div>
        </card>
        <card v-if="isAdmin " title="Cliente ">
          <div class="pd-all-md pd-tp-none " slot="raw-content ">
            <i class="ti-user "></i>
            <div v-if="loadingOwnerData " class="ss-inline-block-spinner mg-lf-sm "></div>
            <span v-else> {{ place.owner.name }}</span>
          </div>
        </card>
      </div>
    </div>

    <div class="row ">
      <div v-if="loading " class="ss-inline-spinner el-center mg-tp-md "></div>
      <template v-else>
        <div class="col-sm-12 mg-bt-md mg-lf-sm ">
          <p-button type="success " round @click.native.prevent="onNewTower ">
            <i class="ti-plus "></i> Adicionar Torre
          </p-button>
        </div>
        <div v-if="noTowersFound " class="col-sm-12 mg-lf-sm text-info ">
          Nenhuma torre cadastrada para este local ainda
        </div>
        <div class="col-sm-6 col-md-4 col-xl-4 tower-card-wrapper " v-for="(tower, index) in towersList " :key="index " @click="onTowerClick(tower) ">
          <stats-card :status="tower.status=='online' ">
            <div class="card-icon icon-xbig text-center icon-success " slot="header ">
              <div>
                <i class="ti-signal "></i>
              </div>
            </div>
            <div class="numbers " slot="content ">
              <p>
                <span class="status online ">online</span>{{tower.name}}
              </p>
              <p class="small-info ">{{ tower.culture }}</p>
              <p class="big-info ">
                {{ tower.environmentTemperature }}°
              </p>
            </div>
            <div class="stats last-upload " slot="footer ">
              <i :class="tower.last_uploadIcon "></i> {{tower.last_upload}}
            </div>
          </stats-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Card, StatsCard } from "@/components/index";
import firebase from "firebase";
import { mapState } from "vuex";
import basePage from "../../../mixins/BasePage.js";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

const touchMap = new WeakMap();

export default {
  mixins: [validationMixin, basePage],
  components: {
    Card,
    StatsCard
  },
  data() {
    return {
      loading: true,
      noTowersFound: false,
      towersList: [],
      loadingPlaceData: true,
      loadingOwnerData: true,
      place: {
        name: "",
        city: "",
        estate: "",
        disabled: false,
        owner: {
          id: "",
          name: ""
        }
      },
      qntTowers: 0,
      togglingDisabled: false,
      editPlace: false,
      editingButtonText: "Editar local",
      editingPlace: false
    };
  },
  validations: {
    place: {
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
        maxLength: minLength(2)
      }
    }
  },
  computed: {
    ...mapState({
      isAdmin: state => state.users.user.isAdmin
    })
  },
  created() {
    const getPlaceData = placeId => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .get()
          .then(placeDocSnapshot => {
            resolve(placeDocSnapshot.data());
          });
      });
    };

    const getTowersList = placeId => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .collection("towers")
          .get()
          .then(towersQuerySnapshot => {
            let towers = [];
            towersQuerySnapshot.forEach(towerDocSnapshot => {
              let towerData = Object.assign(towerDocSnapshot.data(), {
                id: towerDocSnapshot.id
              });
              towers.push(towerData);
            });
            resolve(towers);
          });
      });
    };

    const getUploadIcon = last_upload => {
      if (last_upload) {
        if (last_upload.includes("agora")) {
          return "ti-reload";
        } else if (last_upload.includes("dia")) {
          return "ti-calendar";
        } else if (last_upload.includes("hora")) {
          return "ti-timer";
        } else {
          return "ti-time";
        }
      }

      return "";
    };

    getPlaceData(this.$route.params.placeId).then(placeData => {
      this.place.owner.id = placeData.owner;
      this.place.name = placeData.name;
      this.place.city = placeData.city;
      this.place.estate = placeData.estate;
      this.place.disabled = placeData.disabled;

      this.loadingPlaceData = false;

      if (this.isAdmin) {
        firebase
          .firestore()
          .collection("users_profile")
          .doc(placeData.owner)
          .get()
          .then(ownerSnapshot => {
            this.place.owner.name = ownerSnapshot.data().name;
            this.loadingOwnerData = false;
          });
      }
    });

    getTowersList(this.$route.params.placeId).then(towersList => {
      this.loading = false;
      this.qntTowers = towersList.length;

      if (this.qntTowers == 0) {
        this.noTowersFound = true;
      } else {
        towersList.map(tower => {
          this.towersList.push(
            Object.assign(tower, {
              last_uploadIcon: getUploadIcon(tower.last_upload)
            })
          );
        });
      }
    });
  },
  methods: {
    onGoBack() {
      this.$router.push("/dashboard/index/places");
    },
    onEditFormSubmit() {
      if (this.isAdmin) {
        this.editingPlace = true;
        this.editingButtonText = "Editando...";
        this.$v.$touch();

        firebase
          .firestore()
          .collection("places")
          .doc(this.$route.params.placeId)
          .update({
            name: this.place.name,
            city: this.place.city,
            estate: this.place.estate
          })
          .then(doc => {
            this.editPlace = false;
            this.editingPlace = false;
            this.editingButtonText = "Editar local";
          });
      }
    },
    delayTouch($v) {
      $v.$reset();

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    onToggleDisabled() {
      if (this.isAdmin) {
        this.togglingDisabled = true;

        firebase
          .firestore()
          .collection("places")
          .doc(this.$route.params.placeId)
          .update({
            disabled: !this.place.disabled
          })
          .then(doc => {
            this.place.disabled = !this.place.disabled;
            this.togglingDisabled = false;
          });
      }
    },
    onNewTower() {
      if (this.isAdmin) {
        this.$router.push(`create/${this.place.owner.id}`);
      }
    },
    onTowerClick(tower) {
      this.$router.replace(`tower/${tower.id}`);
    }
  }
};
</script>
<style>
.tower-card-wrapper {
  cursor: pointer;
}

.city-estate-slash {
  float: right;
  position: relative;
  top: -47px;
  left: 15px;
  height: 0;
}
</style>
