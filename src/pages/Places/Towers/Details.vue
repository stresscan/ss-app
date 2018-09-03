<template>
  <div>
    <!-- <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <strong>Atenção!</strong> Temperatura do ambiente acima do normal.
    </div> -->

    <div class="row">
      <div class="col-12">
        <card>
          <div slot="raw-content" class="pd-all-md">
            <a class="back-link" href="#" @click.prevent="onGoBack">
              <i class="ti-arrow-left"></i> Voltar
            </a>
            <p>
              <div v-if="gettingTowerData" class="ss-inline-spinner mg-bt-md"></div>
              <h5 v-else>
                <span class="status online" v-if="!tower.disabled">online</span>
                <span class="status offline" v-else>offline</span>
                {{ tower.name }}
              </h5>
              Local:
              <div v-if="gettingPlaceData" class="ss-inline-block-spinner mg-lf-sm "></div>
              <a href="#" v-else @click.prevent="onGoBack">{{ place.name }}</a>
              <br />Cultura: {{ tower.culture }}
              <div class="stats mg-tp-sm d-block">
                <i :class="tower.last_upload.icon"></i> {{ tower.last_upload.text }}
              </div>
              <span v-if="!showMap" class="stats mg-tp-md d-block">
                <i class="ti-map-alt"></i>
                <a href="#" @click="showMap = !showMap">Mostrar no mapa</a>
              </span>
              <transition name="fade">
                <LocationMap v-if="showMap" :zoom="16" :title="tower.name" :draggable="false" :lat="tower.geolocation.lat" :lng="tower.geolocation.lng" />
              </transition>
              <transition name="fade">
                <a href="#" @click="showMap = !showMap" v-if="showMap" style="margin-top: 20px" class="btn btn-round btn-danger">
                  <i class="ti ti-close" /> Fechar Mapa
                </a>
              </transition>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6 col-md-3" v-for="(stats, index) in tower.stats_cards" :key="index">
        <stats-card :title="stats.title">
          <div class="tower-data-card-content-wrapper" slot="raw-content">
            <div class="tower-data-card-content-icon text-center icon-warning">
              <i :class="`fa fa-${stats.icon}`"></i>
            </div>
            <div v-if="gettingTowerData" class="ss-inline-spinner mg-tp-md mg-lf-md"></div>
            <div v-else class="tower-data-card-numbers">
              {{ stats.number }}{{ stats.numberSign }}
            </div>
          </div>
          <div class="stats" slot="footer">
            <i :class="tower.last_upload.icon"></i> {{ tower.last_upload.text }}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12">
        <chart-card title="Temperatura/Hora" sub-title="Últimas 24 Hours" :chart-data="temperatureChart.data" :chart-options="temperatureChart.options">
          <span slot="footer">
            <i class="ti-reload"></i> Atualizado há 3 minutos
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Ambiente
            <i class="fa fa-circle text-warning"></i> Planta
          </div>
        </chart-card>
      </div>

      <div class="col-12">
        <chart-card title="Umidade/Hora" sub-title="Últimas 24 Hours" :chart-data="humidityChart.data" :chart-options="humidityChart.options">
          <span slot="footer">
            <i class="ti-reload"></i> Atualizado há 3 minutos
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Ambiente
            <i class="fa fa-circle text-warning"></i> Planta
          </div>
        </chart-card>
      </div>

    </div>

  </div>
</template>
<script>
import { StatsCard, ChartCard, LocationMap } from "@/components/index";
import Chartist from "chartist";
import firebase from "firebase";
import basePage from "../../../mixins/BasePage.js";
import getLastUploadMixin from "../../../mixins/PlacesAndTowers/GetLastUploadInfo.js";

export default {
  mixins: [basePage, getLastUploadMixin],
  components: {
    StatsCard,
    ChartCard,
    LocationMap
  },
  data() {
    return {
      gettingPlaceData: true,
      place: {
        name: ""
      },
      gettingTowerData: true,
      tower: {
        name: "",
        culture: "",
        geolocation: {
          lat: "",
          lng: ""
        },
        disabled: false,
        last_stats: {
          datetime: 0,
          environmentHumidity: 0,
          environmentTemperature: 0,
          groundHumidity: 0,
          groundTemperature: 0
        },
        last_upload: {
          icon: "",
          text: ""
        }
      },
      showMap: false,
      temperatureChart: {},
      humidityChart: {}
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

    const getTowerData = (placeId, towerId) => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .collection("towers")
          .doc(towerId)
          .get()
          .then(doc => {
            resolve(Object.assign(doc.data(), { id: doc.id }));
          });
      });
    };

    const getTowerStats = (placeId, towerId) => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .collection("towers")
          .doc(towerId)
          .collection("stats")
          .get()
          .then(querySnapshot => {
            let result = [];

            querySnapshot.forEach(doc => {
              result.push(doc.data());
            });

            resolve(result);
          });
      });
    };

    getPlaceData(this.$route.params.placeId).then(data => {
      this.gettingPlaceData = false;
      this.place = data;
    });

    getTowerData(this.$route.params.placeId, this.$route.params.towerId).then(
      data => {
        this.gettingTowerData = false;

        let statsCardsData = [];

        statsCardsData.push({
          title: "Planta",
          icon: "thermometer-full",
          number: data.last_stats.groundTemperature,
          sign: "°"
        });

        statsCardsData.push({
          title: "Planta",
          icon: "umbrella",
          number: data.last_stats.groundHumidity,
          sign: "%"
        });

        statsCardsData.push({
          title: "Ambiente",
          icon: "thermometer-full",
          number: data.last_stats.environmentTemperature,
          sign: "°"
        });

        statsCardsData.push({
          title: "Ambiente",
          icon: "umbrella",
          number: data.last_stats.environmentHumidity,
          sign: "°"
        });

        Object.assign(data, {
          last_upload: this.getLastUpload(data.last_stats.datetime),
          stats_cards: statsCardsData
        });

        Object.assign(this.tower, data);
      }
    );

    getTowerStats(this.$route.params.placeId, this.$route.params.towerId).then(
      stats => {
        console.log(stats);
        buildTemperatureChart(stats);
        buildHumidityChart(stats);
      }
    );

    const buildTemperatureChart = stats => {
      this.temperatureChart = {
        data: {
          labels: [
            "9h",
            "12h",
            "13h",
            "14h",
            "15h",
            "0h",
            "1h",
            "2h",
            "3h",
            "4h",
            "5h",
            "6h"
          ],
          series: [
            [35, 30, 31, 22, 23, 24, 24, 25, 26, 25, 24, 30],
            [22, 22, 23, 24, 25, 26, 26, 27, 28, 27, 26, 26]
          ]
        },
        options: {
          low: 0,
          high: 35,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      };
    };

    const buildHumidityChart = stats => {
      this.humidityChart = {
        data: {
          labels: [
            "9h",
            "12h",
            "13h",
            "14h",
            "15h",
            "0h",
            "1h",
            "2h",
            "3h",
            "4h",
            "5h",
            "6h"
          ],
          series: [
            [80, 70, 60, 66, 67, 69, 50, 45, 44, 50, 63, 65],
            [22, 22, 23, 24, 25, 26, 26, 27, 28, 27, 26, 26]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "245px"
        }
      };
    };
  },
  methods: {
    onGoBack() {
      this.$router.push("../../towers/list");
    }
  }
};
</script>
<style scoped lang="scss">
.tower-data-card-content-wrapper {
  display: flex;

  .tower-data-card-content-icon {
    flex-grow: 2;
    font-size: 5em;

    @media (min-width: 576px) {
      font-size: 4em;
    }

    @media (min-width: 768px) {
      font-size: 3em;
    }

    @media (min-width: 991px) {
      font-size: 2em;
    }

    @media (min-width: 1100px) {
      font-size: 3em;
    }
  }

  .tower-data-card-numbers {
    flex-grow: 1;
    font-size: 4em;
    margin-left: 10px;
    text-align: center;
    display: flex;
    align-items: center;

    @media (min-width: 576px) {
      font-size: 3em;
    }

    @media (min-width: 768px) {
      font-size: 2em;
    }

    @media (min-width: 1100px) {
      font-size: 3em;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
