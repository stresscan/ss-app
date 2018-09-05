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
                <small class="d-block text-muted">{{ tower.id }}</small>
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

    <!-- Stats -->
    <div v-if="gettingTowerStats" class="ss-inline-spinner mg-tp-md mg-lf-md"></div>
    <template v-else>
      <template v-if="tower.stats.length === 0">
        <div class="row">
          <div class="col-sm-12 mg-lf-sm text-info">
            <i class="fa fa-close"></i>
            <b>Essa torre ainda não possui nenhum dado para ser exibido</b>
          </div>
        </div>
      </template>
      <template v-else>
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
            <chart-card class="chart-temperature" :cardBodyNegativeTop="true" title="Temperatura/Hora" sub-title="Últimas 24 Hours" :chart-data="temperatureChart.data" :chart-options="temperatureChart.options" :chart-responsive-options="temperatureChart.responsiveOptions">
              <span slot="footer">
                <i :class="tower.last_upload.icon"></i> {{ tower.last_upload.text }}
              </span>
              <div slot="legend">
                <div class="mg-bt-sm">
                  <i class="fa fa-circle text-info"></i> Ambiente
                  <i class="fa fa-circle text-warning"></i> Planta
                  <button v-if="areaChart.serieBIsOnTop" class="btn btn-sm mg-lf-xs" @click="bringSeriesToTop('.ct-series-a')">
                    <i class="fa fa-exchange"></i>
                  </button>
                  <button v-if="areaChart.serieAIsOnTop" class="btn btn-sm mg-lf-xs" @click="bringSeriesToTop('.ct-series-b')">
                    <i class="fa fa-exchange"></i>
                  </button>
                </div>
              </div>
            </chart-card>
          </div>

          <div class="col-12">
            <chart-card class="chart-humidity" :cardBodyNegativeTop="true" title="Umidade/Hora" sub-title="Últimas 24 Hours" :chart-data="humidityChart.data" :chart-options="humidityChart.options" :chart-responsive-options="humidityChart.responsiveOptions">
              <span slot="footer">
                <i :class="tower.last_upload.icon"></i> {{ tower.last_upload.text }}
              </span>
              <div slot="legend">
                <i class="fa fa-circle text-info"></i> Ambiente
                <i class="fa fa-circle text-warning"></i> Planta
              </div>
            </chart-card>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import { StatsCard, ChartCard, LocationMap } from "@/components/index";
import Chartist from "chartist";
import ChartistPluginTooltip from "chartist-plugin-tooltips";
import firebase from "firebase";
import basePage from "../../../mixins/BasePage.js";
import getLastUploadMixin from "../../../mixins/PlacesAndTowers/GetLastUploadInfo.js";
import mapStats from "./Charts/MapStats.js";

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
      gettingTowerStats: true,
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
        stats: {
          length: 0
        },
        last_upload: {
          icon: "",
          text: ""
        }
      },
      showMap: false,
      temperatureChart: {},
      humidityChart: {},
      areaChart: {
        serieAIsOnTop: false,
        serieBIsOnTop: true
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
          .orderBy("datetime", "desc")
          .limit(10000)
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
        this.tower.stats.length = stats.length;
        this.gettingTowerStats = false;
        buildStatsCharts(stats);
      }
    );

    const buildStatsCharts = stats => {
      const formatedStats = mapStats.groupStatsByHour(
        mapStats.getOnlyLast24hStats(stats)
      );

      const labels = mapStats.get24hLabels(formatedStats);

      buildTemperatureChart(labels, formatedStats);
      buildHumidityChart(labels, formatedStats);
    };

    const buildTemperatureChart = (labels, data) => {
      const envTemps = mapStats.getAverage(data, "environmentTemperature");
      const groundTemps = mapStats.getAverage(data, "groundTemperature");

      const envSeries = mapStats.getSeries(data, envTemps);
      const groundSeries = mapStats.getSeries(data, groundTemps);

      this.temperatureChart = {
        data: {
          labels,
          series: [[...envSeries], [...groundSeries]]
        },
        options: {
          showArea: true,
          height: "245px",
          fullWidth: true,
          axisX: {
            showGrid: true,
            labelInterpolationFnc: function(value) {
              return value;
            }
          },
          axisY: {
            high: Math.round(Math.max(...envTemps, ...groundTemps)) + 1,
            low: Math.min(...envTemps, ...groundTemps) - 1,
            labelInterpolationFnc: function(value) {
              return value + "°";
            }
          },
          showPoint: true,
          plugins: [
            Chartist.plugins.tooltip({
              anchorToPoint: false,
              class: "chart-tooltip",
              transformTooltipTextFnc: v => ": " + v + "°"
            })
          ]
        },
        responsiveOptions: [
          [
            "screen and (max-width: 560px)",
            {
              axisX: {
                labelInterpolationFnc: v => ""
              }
            }
          ],
          [
            "screen and (min-width: 780px) and (max-width: 990px)",
            {
              axisX: {
                labelInterpolationFnc: v => v + "h"
              }
            }
          ],
          [
            "screen and (min-width: 1060px)",
            {
              axisX: {
                labelInterpolationFnc: v => v + "h"
              }
            }
          ]
        ]
      };
    };

    const buildHumidityChart = (labels, data) => {
      const envHumidity = mapStats.getAverage(data, "environmentHumidity");
      const groundHumidity = mapStats.getAverage(data, "groundHumidity");

      const envSeries = mapStats.getSeries(data, envHumidity);
      const groundSeries = mapStats.getSeries(data, groundHumidity);

      this.humidityChart = {
        data: {
          labels,
          series: [[...envSeries], [...groundSeries]]
        },
        options: {
          height: "245px",
          fullWidth: true,
          axisX: {
            showGrid: false,
            labelInterpolationFnc: v => v
          },
          axisY: {
            high: Math.round(Math.max(...envHumidity, ...groundHumidity)) + 1,
            low: Math.min(...envHumidity, ...groundHumidity) - 1,
            labelInterpolationFnc: v => v + "%"
          },
          showPoint: true,
          plugins: [
            Chartist.plugins.tooltip({
              anchorToPoint: false,
              class: "chart-tooltip-humidity",
              transformTooltipTextFnc: v => ": " + v + "%"
            })
          ]
        },
        responsiveOptions: [
          [
            "screen and (max-width: 560px)",
            {
              axisX: {
                labelInterpolationFnc: v => ""
              }
            }
          ],
          [
            "screen and (min-width: 780px) and (max-width: 990px)",
            {
              axisX: {
                labelInterpolationFnc: v => v + "h"
              }
            }
          ],
          [
            "screen and (min-width: 1060px)",
            {
              axisX: {
                labelInterpolationFnc: v => v + "h"
              }
            }
          ]
        ]
      };
    };
  },
  methods: {
    onGoBack() {
      this.$router.push("../../towers/list");
    },
    bringToTop(targetElement) {
      this.$nextTick(() => {
        let parent = targetElement.parentNode;
        parent.appendChild(targetElement);
      });
    },
    bringSeriesToTop(serie) {
      this.$nextTick(() => {
        this.bringToTop(document.querySelector(serie));

        if (serie.includes("a")) {
          this.areaChart.serieAIsOnTop = true;
          this.areaChart.serieBIsOnTop = false;
        } else {
          this.areaChart.serieAIsOnTop = false;
          this.areaChart.serieBIsOnTop = true;
        }
      });
    }
  }
};
</script>
<style lang="scss">
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
