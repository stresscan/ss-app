<template>
  <div @click.stop="onOutsideClick">
    <a class="back-link" href="#" @click="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div class="row">
      <div class="col-12">
        <card>
          <div slot="raw-content" class="pd-all-md">
            <a href="#" v-if="stateIsAdmin && !editPlace" @click.prevent="onEditPlace">
              <i class="ti-pencil "></i> Editar
            </a>

            <div v-if="loadingPlaceData" class="ss-inline-spinner el-center mg-tp-md "></div>
            <template v-else>
              <form @submit.prevent="onEditFormSubmit">
                <h3 v-if="!editPlace">
                  <span class="status online" v-if="!place.disabled">online</span>
                  <span class="status offline" v-else>offline</span>{{ place.name }}
                </h3>
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
                  <i class="ti-location-pin "></i> {{ place.location.city }}/{{ place.location.estate }}<br /> {{ place.location.address }}, {{ place.location.number }}<br /> {{ place.location.district }}<br /> {{ place.location.postalCode }}
                </template>
                <template v-else>
                  <div class="row">
                    <div class="col-sm-4">
                      <ss-fg-input :spinner="searchingPostalCode" :class="{'has-error': $v.place.location.postalCode.$error}" @input="delayTouch($v.place.location.postalCode)" type="text" v-mask="'#####-###'" maxlength="9" label="CEP" placeholder="CEP" v-model.trim="place.location.postalCode"></ss-fg-input>
                      <ul class="field-error-message " v-if="$v.place.location.postalCode.$error">
                        <li v-if="!$v.place.location.postalCode.required">
                          Campo requerido
                        </li>
                        <li v-if="!$v.place.location.postalCode.isValid ">
                          Esse CEP não é válido
                        </li>
                      </ul>
                    </div>

                    <div class="col-md-8">
                      <ss-fg-input :class="{'has-error': $v.place.location.district.$error}" @input="delayTouch($v.place.location.district)" type="text" label="Bairro" placeholder="Bairro" v-model.trim="place.location.district"></ss-fg-input>
                      <ul class="field-error-message " v-if="$v.place.location.district.$error">
                        <li v-if="!$v.place.location.district.required">
                          Campo requerido
                        </li>
                        <li v-if="!$v.place.location.district.minLength ">
                          Bairro precisa ter no mínimo {{ $v.place.location.district.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-10 ">
                      <ss-fg-input :class="{ 'has-error': $v.place.location.city.$error} " @input="delayTouch($v.place.location.city) " type="text " label="Cidade " placeholder="Cidade " maxlength="50 " v-model.trim="place.location.city "></ss-fg-input>
                      <span class="d-none d-sm-block city-estate-slash ">/</span>
                      <ul class="field-error-message " v-if="$v.place.location.city.$error ">
                        <li v-if="!$v.place.location.city.required ">
                          Campo requerido
                        </li>
                        <li v-if="!$v.place.location.city.minLength ">
                          Cidade precisa ter no mínimo {{ $v.place.location.city.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                      <ul class="field-error-message d-none d-sm-block" v-if="$v.place.location.estate.$error">
                        <li v-if="!$v.place.location.estate.required">
                          Campo UF é requerido
                        </li>
                        <li v-if="!$v.place.location.estate.minLength || !$v.place.location.estate.maxLength">
                          UF precisa ter {{ $v.place.location.estate.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                    </div>

                    <div class="col-sm-2">
                      <ss-fg-input :uppercase="true " :class="{ 'has-error': $v.place.location.estate.$error} " @input="delayTouch($v.place.location.estate) " type="text " label="UF " maxlength="2 " placeholder="UF " v-model.trim="place.location.estate "></ss-fg-input>
                      <ul class="field-error-message d-sm-none" v-if="$v.place.location.estate.$error">
                        <li v-if="!$v.place.location.estate.required">
                          Campo UF é requerido
                        </li>
                        <li v-if="!$v.place.location.estate.minLength || !$v.place.location.estate.maxLength">
                          UF precisa ter {{ $v.place.location.estate.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-8">
                      <ss-fg-input :class="{'has-error': $v.place.location.address.$error}" @input="delayTouch($v.place.location.address)" maxlength="100" type="text" label="Endereço" placeholder="Endereço" v-model.trim="place.location.address"></ss-fg-input>
                      <ul class="field-error-message " v-if="$v.place.location.address.$error">
                        <li v-if="!$v.place.location.address.required">
                          Campo requerido
                        </li>
                        <li v-if="!$v.place.location.address.minLength ">
                          Endereço precisa ter no mínimo {{ $v.place.location.address.$params.minLength.min }} caracteres
                        </li>
                      </ul>
                    </div>

                    <div class="col-md-4">
                      <ss-fg-input :class="{'has-error': $v.place.location.number.$error}" @input="delayTouch($v.place.location.number)" type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="place.location.number"></ss-fg-input>
                      <ul class="field-error-message " v-if="$v.place.location.number.$error">
                        <li v-if="!$v.place.location.number.required">
                          Campo requerido
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="mg-bt-md">
                    <p-button type="info" nativeType="submit" :disabled="$v.$invalid || editingPlace" round>
                      {{ editingButtonText }}
                    </p-button>
                    <a href="#" @click.prevent="onCancelEditPlace" class="mg-lf-sm">Cancelar</a>
                  </div>
                </template>
              </form>
              <br />
              <i class="ti-signal"></i> {{ qntTowers }} torre(s)
              <div v-if="stateIsAdmin" class="mg-tp-md ">
                <span :class="{ 'text-danger': place.disabled, 'text-success': !place.disabled}">
                  <i class="ti-flag"></i> {{ place.disabled ? "Desativado " : "Ativado " }}
                </span>
                <a v-if="!togglingPlaceDisabled" href="#" @click.prevent="onPlaceToggleDisabled">{{ place.disabled ? "Ativar " : "Desativar " }}</a>
                <div v-else class="ss-inline-block-spinner mg-lf-sm "></div>
              </div>
            </template>
          </div>
        </card>
        <card v-if="stateIsAdmin" title="Cliente ">
          <div class="pd-all-md pd-tp-none" slot="raw-content">
            <i class="ti-user"></i>
            <div v-if="loadingOwnerData" class="ss-inline-block-spinner mg-lf-sm "></div>
            <span v-else> {{ place.owner.name }}</span>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div v-if="loading" class="ss-inline-spinner el-center mg-tp-md"></div>
      <template v-else>
        <div v-if="stateIsAdmin" class="col-sm-12 mg-bt-md mg-lf-sm ">
          <p-button type="success " round @click.native.prevent="onNewTower">
            <i class="ti-plus "></i> Adicionar Torre
          </p-button>
        </div>
        <div v-if="noTowersFound " class="col-sm-12 mg-lf-sm text-info">
          <i class="fa fa-close"></i>
          <b>Nenhuma torre cadastrada para este local ainda</b>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-4 tower-card-wrapper" v-for="(tower, index) in towersList " :key="index " @click="onTowerClick(tower) ">
          <stats-card :disabled="tower.disabled">
            <div slot="header" class="tower-options">
              <a href="#" @click.prevent.stop="onTowerToggleSuspendedMenu(tower)">
                <i class="fa fa-ellipsis-v"></i>
              </a>
              <ul v-if="tower.showSuspendedMenu" class="tower-menu-options">
                <li>
                  <div class="seta"></div>
                </li>
                <li v-if="stateIsAdmin">
                  <i class="ti-pencil"></i>
                  <a href="#" @click.prevent.stop="onTowerEdit(tower)">Editar</a>
                </li>
                <li v-if="stateIsAdmin">
                  <i class="ti-flag" :class="{ 'text-danger': tower.disabled, 'text-success': !tower.disabled}"></i>
                  <a v-if="!togglingTowerDisabled" href="#" @click.prevent.stop="onTowerToggleDisabled(tower)">{{ tower.disabled ? "Ativar" : "Desativar" }}</a>
                  <div v-else class="ss-spinner ss-inline-block-spinner mg-lf-sm"></div>
                </li>
                <li>
                  <i class="ti-bell"></i>
                  <a href="#" @click.prevent.stop="onTowerAlerts(tower)">Alertas</a>
                </li>
              </ul>
            </div>
            <div class="card-icon icon-xbig text-center icon-success" slot="header">
              <div>
                <i class="ti-signal"></i>
              </div>
            </div>
            <div class="numbers" slot="content">
              <p>
                <span v-if="tower.disabled" class="status offline">offline</span>
                <span v-else class="status online">online</span>{{tower.name}}
              </p>
              <p class="small-info text-muted tower-code">
                <span>{{ tower.id }}</span>
              </p>
              <p class="small-info">{{ tower.culture }}</p>
              <p class="big-info">
                {{ tower.last_stats.environment_temperature }}°
              </p>
            </div>
            <div class="stats last-upload" slot="footer">
              <i :class="tower.last_upload.icon"></i> {{ tower.last_upload.text }}
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
import basePage from "@/mixins/BasePage.js";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import axios from "axios";
import { mask } from "vue-the-mask";
import getLastUploadMixin from "@/mixins/PlacesAndTowers/GetLastUploadInfo.js";

const touchMap = new WeakMap();

export default {
  directives: { mask },
  mixins: [validationMixin, basePage, getLastUploadMixin],
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
        location: {
          postalCode: "",
          city: "",
          estate: "",
          address: "",
          number: "",
          district: ""
        },
        disabled: false,
        owner: {
          id: "",
          name: ""
        }
      },
      qntTowers: 0,
      togglingPlaceDisabled: false,
      editPlace: false,
      editingButtonText: "Editar local",
      editingPlace: false,
      searchingPostalCode: false,
      placeEditingDataBkp: {},
      placeEditingLocationBkp: {},
      togglingTowerDisabled: false
    };
  },
  validations: {
    place: {
      name: {
        required,
        minLength: minLength(3)
      },
      location: {
        postalCode: {
          required,
          isValid(value) {
            if (value === "") return true;
            return new Promise((resolve, reject) => {
              this.place.location.city = "";
              this.place.location.estate = "";
              this.place.location.address = "";
              this.place.location.district = "";
              this.searchingPostalCode = true;

              axios
                .get(
                  `https://viacep.com.br/ws/${
                    this.place.location.postalCode
                  }/json/`
                )
                .then(
                  address => {
                    if (address.data.erro) {
                      this.searchingPostalCode = false;
                      resolve(false);
                    }

                    this.place.location.city = address.data.localidade;
                    this.place.location.estate = address.data.uf;
                    this.place.location.address = address.data.logradouro;
                    this.place.location.district = address.data.bairro;
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
        },
        address: {
          required,
          minLength: minLength(4)
        },
        district: {
          required,
          minLength: minLength(4)
        },
        number: {
          required
        }
      }
    }
  },
  computed: {
    ...mapState({
      stateIsAdmin: state => state.users.user.isAdmin
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
          .then(doc => {
            resolve(doc.data());
          });
      });
    };

    const getTowersList = (placeId, includeDisables) => {
      return new Promise(resolve => {
        const collectionRef = firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .collection("towers");

        let query = collectionRef;

        if (!includeDisables) {
          query = query.where("disabled", "==", false);
        }

        query.get().then(towersQuerySnapshot => {
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

    const getTowerLastStats = (placeId, towerId) => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .collection("towers")
          .doc(towerId)
          .collection("stats")
          .orderBy("datetime", "desc")
          .limit(1)
          .get()
          .then(querySnapshot => {
            let last_stat;
            querySnapshot.forEach(doc => {
              last_stat = doc.data();
            });
            resolve(last_stat || {});
          });
      });
    };

    getPlaceData(this.$route.params.placeId).then(placeData => {
      this.place = placeData;
      this.place.owner = { id: placeData.owner };

      this.loadingPlaceData = false;

      if (this.stateIsAdmin) {
        firebase
          .firestore()
          .collection("users_profile")
          .doc(placeData.owner.id)
          .get()
          .then(doc => {
            this.place.owner.name = doc.data().name;
            this.loadingOwnerData = false;
          });
      }
    });

    getTowersList(this.$route.params.placeId, this.stateIsAdmin).then(
      towersList => {
        this.loading = false;
        this.qntTowers = towersList.length;

        if (this.qntTowers == 0) {
          this.noTowersFound = true;
        } else {
          towersList.map(tower => {
            getTowerLastStats(this.$route.params.placeId, tower.id).then(
              last_stats => {
                this.towersList.push(
                  Object.assign(tower, {
                    last_stats: last_stats || {},
                    last_upload: this.getLastUpload(last_stats.datetime || 0),
                    showSuspendedMenu: false
                  })
                );
              }
            );
          });
        }
      }
    );
  },
  methods: {
    onOutsideClick() {
      this.closeAllSuspendedMenu();
    },
    closeAllSuspendedMenu() {
      this.towersList.map(item => {
        item.showSuspendedMenu = false;
      });
    },
    onGoBack() {
      this.$router.push(
        `/dashboard/index/places?clientId=${this.place.owner.id}`
      );
    },
    onEditPlace() {
      this.$v.$reset();
      this.editPlace = true;

      const placeDataBkp = this.place;
      const placeDataLocationBkp = this.place.location;
      this.placeEditingDataBkp = { ...placeDataBkp };
      this.placeEditingLocationBkp = { ...placeDataLocationBkp };

      this.scrollTop();
    },
    onCancelEditPlace() {
      this.$v.$reset();
      this.editPlace = false;

      this.place = this.placeEditingDataBkp;
      this.place.location = this.placeEditingLocationBkp;
      this.scrollTop();
    },
    delayTouch($v) {
      $v.$reset();

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    onEditFormSubmit() {
      if (this.stateIsAdmin) {
        this.editingPlace = true;
        this.editingButtonText = "Editando...";
        this.$v.$touch();

        firebase
          .firestore()
          .collection("places")
          .doc(this.$route.params.placeId)
          .update({
            name: this.place.name,
            location: {
              postalCode: this.place.location.postalCode,
              city: this.place.location.city,
              estate: this.place.location.estate.toUpperCase(),
              address: this.place.location.address,
              number: this.place.location.number,
              district: this.place.location.district
            }
          })
          .then(doc => {
            this.editPlace = false;
            this.editingPlace = false;
            this.editingButtonText = "Editar local";
          });
      }
    },
    onPlaceToggleDisabled() {
      if (this.stateIsAdmin) {
        this.togglingPlaceDisabled = true;

        firebase
          .firestore()
          .collection("places")
          .doc(this.$route.params.placeId)
          .update({
            disabled: !this.place.disabled
          })
          .then(doc => {
            this.place.disabled = !this.place.disabled;
            this.togglingPlaceDisabled = false;
          });
      }
    },
    onNewTower() {
      if (this.stateIsAdmin) {
        this.$router.push("create");
      }
    },
    onTowerToggleSuspendedMenu(tower) {
      this.closeAllSuspendedMenu();
      this.towersList.map(item => {
        if (item.id === tower.id) {
          item.showSuspendedMenu = !tower.showSuspendedMenu;
        }
      });
    },
    onTowerToggleDisabled(tower) {
      if (this.stateIsAdmin) {
        this.togglingTowerDisabled = true;

        firebase
          .firestore()
          .collection("places")
          .doc(this.$route.params.placeId)
          .collection("towers")
          .doc(tower.id)
          .update({
            disabled: !tower.disabled
          })
          .then(doc => {
            tower.disabled = !tower.disabled;
            this.togglingTowerDisabled = false;
          });
      }
    },
    onTowerEdit(tower) {
      this.$router.replace(`../tower/${tower.id}/edit`);
    },
    onTowerAlerts(tower) {
      this.$router.replace(`../tower/${tower.id}/alerts`);
    },
    onTowerClick(tower) {
      this.$router.replace(`../tower/${tower.id}/details`);
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

.tower-code {
  width: 100%;
  text-align: right;
}

.tower-code span {
  display: inline-block;
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tower-options > a {
  display: block;
  padding: 5px;
  color: #333;
  position: absolute;
  top: -10px;
  left: 6px;
  width: 122px;
}

@media (min-width: 375px) {
  .tower-options > a {
    left: -30px;
  }
}

@media (min-width: 480px) {
  .tower-options > a {
    left: -59px;
  }
}

@media (min-width: 575px) {
  .tower-options > a {
    left: 6px;
  }
}

.tower-options > ul {
  display: inline-block;
  position: absolute;
  z-index: 2;
  left: 8px;
  list-style: none;
  padding: 5px 0 10px;
  margin-top: 22px;
  background: #f8f8f8;
  border: solid 1px #f0f0f0;
  border-radius: 5px;
  width: 170px;
}

@media (min-width: 375px) {
  .tower-options > ul {
    left: -30px;
  }
}

@media (min-width: 480px) {
  .tower-options > ul {
    left: -59px;
  }
}

@media (min-width: 575px) {
  .tower-options > ul {
    left: 6px;
  }
}

.tower-options > ul > li {
  padding: 11px 19px 9px;
}

.tower-options > ul > li > i,
.tower-options > ul > li > .ss-spinner {
  position: relative;
  top: 8px;
}

.tower-options > ul > li:nth-child(1) {
  position: absolute;
  top: -15px;
  left: -11px;
  padding: 8px 19px 9px;
}

.tower-options > ul > li:nth-child(1) > .seta {
  border: solid #f0f0f0;
  width: 12px;
  border-bottom-width: 6px;
  border-top: none;
  border-left-width: 6px;
  border-left-color: transparent;
  border-right-width: 6px;
  border-right-color: transparent;
  position: absolute;
}

.tower-options > ul > li > a {
  position: absolute;
  z-index: 2;
  margin-left: 5px;
  margin-bottom: 5px;
  padding: 5px;
}

.tower-options > ul > li > a:hover {
  text-decoration: underline;
}
</style>
