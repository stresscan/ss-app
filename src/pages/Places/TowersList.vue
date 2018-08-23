<template>
  <div>
    <div class="row">
      <div class="col-12">
        <card>
          <div slot="raw-content" style="padding: 20px">
            <div v-if="loadingPlaceData" class="ss-inline-spinner el-center mg-tp-md"></div>
            <template v-else>
              {{ place.name }}
              <br />{{ place.city }}/{{ place.estate }}
            </template>

            <a style="display: block; margin-top: 10px" href="#" @click="onGoBack">
              <i class="ti-arrow-left"></i> Voltar
            </a>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div v-if="loading" class="ss-inline-spinner el-center mg-tp-md"></div>
      <template v-else>
        <div v-if="noTowersFound" class="mg-lf-sm text-info">
          Nenhuma torre cadastrada para este local ainda
        </div>
        <div class="col-sm-6 col-md-4 col-xl-4" style="cursor: pointer" v-for="(tower, index) in towersList" :key="index" @click="onTowerClick(tower)">
          <stats-card :status="tower.status == 'online'">
            <div class="card-icon icon-xbig text-center icon-success" slot="header">
              <div>
                <i class="ti-signal"></i>
              </div>
            </div>
            <div class="numbers" slot="content">
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
      place: {
        name: "",
        city: "",
        estate: ""
      }
    };
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
      this.place.name = placeData.name;
      this.place.city = placeData.city;
      this.place.estate = placeData.estate;

      this.loadingPlaceData = false;
    });

    getTowersList(this.$route.params.placeId).then(towersList => {
      this.loading = false;

      if (towersList.length == 0) {
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
    onTowerClick(tower) {
      this.$router.push(
        `/dashboard/index/places/${this.$route.params.placeId}/tower/${
          tower.id
        }`
      );
    }
  }
};
</script>
<style>
</style>
