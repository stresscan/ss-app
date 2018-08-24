<template>
  <div>
    <a class="back-link" href="#" @click="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div class="row">
      <div class="col-12">
        <card :title="place.name">
          <div slot="raw-content" class="pd-all-md">
            <div v-if="loadingPlaceData" class="ss-inline-spinner el-center mg-tp-md"></div>
            <template v-else>
              <i class="ti-location-pin"></i> {{ place.city }}/{{ place.estate }}
              <br />
              <i class="ti-signal"></i> {{ qntTowers }} torre(s)
              <div v-if="isAdmin" class="mg-tp-md">
                <span :class="{ 'text-danger': place.disabled, 'text-success': !place.disabled}">
                  <i class="ti-flag"></i> {{ place.disabled ? "Desativado" : "Ativado" }}
                </span>
                <a v-if="!togglingDisabled" href="#" @click.prevent="onToggleDisabled">{{ place.disabled ? "Ativar" : "Desativar" }}</a>
                <div v-else class="ss-inline-block-spinner mg-lf-sm"></div>
              </div>
            </template>
          </div>
        </card>
        <card v-if="isAdmin" title="Cliente">
          <div class="pd-all-md pd-tp-none" slot="raw-content">
            <i class="ti-user"></i>
            <div v-if="loadingOwnerData" class="ss-inline-block-spinner mg-lf-sm"></div>
            <span v-else> {{ place.owner.name }}</span>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div v-if="loading" class="ss-inline-spinner el-center mg-tp-md"></div>
      <template v-else>
        <div class="col-sm-12 mg-bt-md mg-lf-sm">
          <p-button type="success" round @click.native.prevent="onNewTower">
            <i class="ti-plus"></i> Adicionar Torre
          </p-button>
        </div>
        <div v-if="noTowersFound" class="col-sm-12 mg-lf-sm text-info">
          Nenhuma torre cadastrada para este local ainda
        </div>
        <div class="col-sm-6 col-md-4 col-xl-4 tower-card-wrapper" v-for="(tower, index) in towersList" :key="index" @click="onTowerClick(tower)">
          <stats-card :status="tower.status == 'online'">
            <div class="card-icon icon-xbig text-center icon-success" slot="header">
              <div>
                <i class="ti-signal"></i>
              </div>
            </div>
            <div class="numbers" slot="content">
              <p>
                <span class="status online">online</span>{{tower.name}}
              </p>
              <p class="small-info">{{ tower.culture }}</p>
              <p class="big-info">
                {{ tower.environmentTemperature }}°
              </p>
            </div>
            <div class="stats last-upload" slot="footer">
              <i :class="tower.last_uploadIcon"></i> {{tower.last_upload}}
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

export default {
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
      togglingDisabled: false
    };
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
        this.$router.push(`towers/create/${this.place.owner.id}`);
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
</style>
