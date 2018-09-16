<template>
  <div>
    <a class="back-link" href="#" @click.prevent="onAddData">
      Inserir dados aleatórios
    </a>
    <div class="alert alert-warning alert-dismissible fade show" v-for="(item, index) in notificationsList" :key="index" v-if="item.show" role="alert">
      <button type="button" class="close" @click.prevent="onCloseNotification(item)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <small>{{ item.datetime.getDate() + '/' + item.datetime.getMonth() + 1 + "/" + item.datetime.getFullYear() + ' ' + item.datetime.getHours() + 'h' + item.datetime.getMinutes()}}</small><br />
      <strong>Atenção!</strong> {{ item.msg }}.
    </div>

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
            <b>Essa torre ainda não possui dados a serem exibido</b>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-sm-6 col-md-3" v-for="(stats, index) in tower.stats_cards" :key="index">
            <stats-card :title="stats.title" subtitle="última medição recebida">
              <div class="tower-data-card-content-wrapper" slot="raw-content">
                <div class="tower-data-card-content-icon text-center" :class="{'icon-warning': stats.title === 'Planta', 'icon-info': stats.title === 'Ambiente'}">
                  <i :class="`fa fa-${stats.icon}`"></i>
                </div>
                <div v-if="gettingTowerData" class="ss-inline-spinner mg-tp-md mg-lf-md"></div>
                <div v-else class="tower-data-card-numbers">
                  {{ stats.number }}{{ stats.sign }}
                </div>
              </div>
              <div class="stats" slot="footer">
                <i :class="tower.last_upload.icon"></i> {{ stats.date }}
              </div>
            </stats-card>
          </div>
        </div>

        <!--Charts-->
        <div class="row">
          <div class="col-12">
            <chart-card class="chart-temperature" :cardBodyNegativeTop="true" title="Média de Temperatura por Hora" :sub-title="`${last24hStatsLength} medições recebidas nas últimas 24 Horas`" :chart-data="temperatureChart.data" :chart-options="temperatureChart.options" :chart-responsive-options="temperatureChart.responsiveOptions">
              <span slot="footer">
                <i :class="tower.last_upload.icon"></i> {{ tower.last_upload.text }}
              </span>
              <div slot="legend">
                <div class="mg-bt-sm">
                  <i class="fa fa-circle text-info"></i> Ambiente
                  <i class="fa fa-circle text-warning"></i> Planta
                  <button v-if="areaChart.serieBOnTop" class="btn btn-sm mg-lf-xs" @click="bringSeriesToTop('.ct-series-a')">
                    <i class="fa fa-exchange"></i>
                  </button>
                  <button v-if="areaChart.serieAOnTop" class="btn btn-sm mg-lf-xs" @click="bringSeriesToTop('.ct-series-b')">
                    <i class="fa fa-exchange"></i>
                  </button>
                </div>
              </div>
            </chart-card>
          </div>

          <div class="col-12">
            <chart-card class="chart-humidity" :cardBodyNegativeTop="true" title="Média de Umidade por Hora" :sub-title="`${last24hStatsLength} medições recebidas nas últimas 24 Horas`" :chart-data="humidityChart.data" :chart-options="humidityChart.options" :chart-responsive-options="humidityChart.responsiveOptions">
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
import basePage from "@/mixins/BasePage.js";
import getLastUploadMixin from "@/mixins/PlacesAndTowers/GetLastUploadInfo.js";
import mapTowerStats from "./Charts/MapTowerStats.js";

export default {
  mixins: [basePage, getLastUploadMixin],
  components: {
    StatsCard,
    ChartCard,
    LocationMap
  },
  data() {
    return {
      last24hStatsLength: 0,
      notificationsList: [],
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
        serieAOnTop: false,
        serieBOnTop: true
      }
    };
  },
  created() {
    const getRealTimeNotificationsList = (placeId, towerId) => {
      firebase
        .firestore()
        .collection("notifications")
        .where("place", "==", placeId)
        .where("tower", "==", towerId)
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.notificationsList.unshift(
                Object.assign(change.doc.data(), {
                  id: change.doc.id,
                  datetime: new Date(change.doc.data().datetime),
                  show: false
                })
              );
            }

            if (change.type === "removed") {
              this.notificationsList = this.notificationsList.filter(
                item => item.id !== change.doc.id
              );
            }
          });

          const totalOfNotifications = querySnapshot.size;

          for (let i = 1; i <= totalOfNotifications; i++) {
            setTimeout(() => {
              if (this.notificationsList[i - 1]) {
                this.notificationsList[i - 1].show = true;
              }
            }, i * 100);
          }
        });
    };

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

    const getRealTimeTowerData = (placeId, towerId) => {
      firebase
        .firestore()
        .collection("places")
        .doc(placeId)
        .collection("towers")
        .doc(towerId)
        .onSnapshot(snapshot => {
          this.tower = Object.assign(this.tower, snapshot.data());
          this.gettingTowerData = false;
        });
    };

    const getRealTimeTowerStats = (placeId, towerId) => {
      firebase
        .firestore()
        .collection("places")
        .doc(placeId)
        .collection("towers")
        .doc(towerId)
        .collection("stats")
        .orderBy("datetime")
        .limit(10000)
        .onSnapshot(queryStatsSnapshot => {
          this.gettingTowerStats = true;
          let statsCharts = [];

          queryStatsSnapshot.forEach(doc => {
            let statsCardsData = [];
            const d = new Date(doc.data().datetime);
            const date = `${d.getDate()}/${d.getMonth() +
              1}/${d.getFullYear()} ${d.getHours()}h${d.getMinutes()}`;

            statsCardsData.push({
              title: "Planta",
              icon: "thermometer-full",
              number: doc.data().ground_temperature || 0,
              sign: "°",
              date
            });

            statsCardsData.push({
              title: "Ambiente",
              icon: "thermometer-full",
              number: doc.data().environment_temperature || 0,
              sign: "°",
              date
            });

            statsCardsData.push({
              title: "Planta",
              icon: "umbrella",
              number: doc.data().ground_humidity || 0,
              sign: "%",
              date
            });

            statsCardsData.push({
              title: "Ambiente",
              icon: "umbrella",
              number: doc.data().environment_humidity || 0,
              sign: "%",
              date
            });

            this.tower = Object.assign(this.tower, {
              last_upload: this.getLastUpload(
                doc.data().datetime || Date.now().getTime()
              ),
              stats_cards: statsCardsData
            });

            statsCharts.push(Object.assign(doc.data(), { id: doc.id }));
          });

          this.tower.stats.length = statsCharts.length;
          this.gettingTowerStats = false;
          buildStatsCharts(statsCharts);
        });
    };

    getPlaceData(this.$route.params.placeId).then(data => {
      this.gettingPlaceData = false;
      this.place = data;
    });

    getRealTimeTowerData(
      this.$route.params.placeId,
      this.$route.params.towerId
    );

    getRealTimeNotificationsList(
      this.$route.params.placeId,
      this.$route.params.towerId
    );

    getRealTimeTowerStats(
      this.$route.params.placeId,
      this.$route.params.towerId
    );

    const buildStatsCharts = stats => {
      const last24hStats = mapTowerStats.getOnlyLast24hStats(stats);
      this.last24hStatsLength = last24hStats.length;

      const statsGroupedByDayAndHour = mapTowerStats.groupStatsByHour(
        last24hStats
      );

      const labels = mapTowerStats.getLabels(
        statsGroupedByDayAndHour.stats,
        statsGroupedByDayAndHour.index
      );

      buildTemperatureChart(
        labels,
        statsGroupedByDayAndHour.stats,
        statsGroupedByDayAndHour.index
      );

      buildHumidityChart(
        labels,
        statsGroupedByDayAndHour.stats,
        statsGroupedByDayAndHour.index
      );
    };

    const buildTemperatureChart = (labels, data, dataIndex) => {
      const envTemps = mapTowerStats.getAverage(
        data,
        dataIndex,
        "environment_temperature"
      );

      const grTemps = mapTowerStats.getAverage(
        data,
        dataIndex,
        "ground_temperature"
      );

      const envSeries = mapTowerStats.getSeries(data, dataIndex, envTemps);
      const grSeries = mapTowerStats.getSeries(data, dataIndex, grTemps);

      this.temperatureChart = {
        data: {
          labels,
          series: [[...envSeries], [...grSeries]]
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
            high: Math.round(Math.max(...envTemps, ...grTemps)) + 1,
            low: Math.min(...envTemps, ...grTemps) - 1,
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

    const buildHumidityChart = (labels, data, dataIndex) => {
      const envHumidity = mapTowerStats.getAverage(
        data,
        dataIndex,
        "environment_humidity"
      );

      const groundHumidity = mapTowerStats.getAverage(
        data,
        dataIndex,
        "ground_humidity"
      );

      const envSeries = mapTowerStats.getSeries(data, dataIndex, envHumidity);
      const grSeries = mapTowerStats.getSeries(data, dataIndex, groundHumidity);

      this.humidityChart = {
        data: {
          labels,
          series: [[...envSeries], [...grSeries]]
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
    onCloseNotification(notification) {
      notification.show = false;

      firebase
        .firestore()
        .collection("notifications")
        .doc(notification.id)
        .delete()
        .then()
        .catch(e => {
          logService.logError(
            new Date().getTime(),
            `A Notificação não pode ser excluída: ${e.message}`,
            "onCloseNotification",
            "tower details",
            this.stateUid
          );
        });
    },
    bringToTop(targetElement) {
      this.$nextTick(() => {
        let parent = targetElement.parentNode;
        parent.appendChild(targetElement);
      });
    },
    onAddData() {
      let d = new Date();
      d.setHours(d.getHours() - 24);

      for (let i = 0; i < 96; i++) {
        const time = d.setMinutes(d.getMinutes() + 15);
        const newData = {
          datetime: time,
          environment_humidity: Math.floor(Math.random() * 20) + 60,
          environment_temperature: Math.floor(Math.random() * 10) + 25,
          ground_humidity: Math.floor(Math.random() * 60) + 40,
          ground_temperature: Math.floor(Math.random() * 18) + 30
        };

        firebase
          .firestore()
          .collection("places")
          .doc(this.$route.params.placeId)
          .collection("towers")
          .doc(this.$route.params.towerId)
          .collection("stats")
          .add(newData);
      }
    },
    bringSeriesToTop(serie) {
      this.$nextTick(() => {
        this.bringToTop(document.querySelector(serie));

        if (serie.includes("a")) {
          this.areaChart.serieAOnTop = true;
          this.areaChart.serieBOnTop = false;
        } else {
          this.areaChart.serieAOnTop = false;
          this.areaChart.serieBOnTop = true;
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
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
