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
          <div slot="raw-content" style="padding: 20px">
            <p>
              <span class="status online" v-if="status">online</span>
              <span class="status offline" v-else>offline</span>
              SS0
              <br />Local:
              <a href="/#/towers">Fazenda #1</a>
              <br />Cultura: Laranja
              <span class="stats" style="margin-top: 15px; display: block">
                <i class="ti-calendar"></i>
                Atualizado há menos de 1h
              </span>
              <span v-if="!showMap" class="stats" style="margin-top: 5px; display: block">
                <i class="ti-map-alt"></i>
                <a href="#" @click="showMap = !showMap">Mostrar no mapa</a>
              </span>
              <transition name="fade">
                <a href="#" @click="showMap = !showMap" v-if="showMap" style="margin-top: 20px" class="btn btn-round btn-danger">
                  <i class="ti ti-close" /> Fechar Mapa
                </a>
              </transition>
              <transition name="fade">
                <LocationMap v-if="showMap" :lat="lat" :lng="lng" />
              </transition>
            </p>
            <a class="back-link" href="#" @click.prevent="onGoBack">
              <i class="ti-arrow-left"></i> Voltar
            </a>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6 col-md-3">
        <stats-card>
          <div class="icon-big text-center icon-warning" slot="header">
            <i class="ti-shine"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Ambiente - Temperatura</p>
            25°
          </div>
          <div class="stats" slot="footer">
            <i class="ti-reload"></i> Atualizado agora
          </div>
        </stats-card>
      </div>
      <div class="col-sm-6 col-md-3">
        <stats-card>
          <div class="icon-big text-center icon-warning" slot="header">
            <i class="ti-ink-pen"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Planta - Temperatura</p>
            23°
          </div>
          <div class="stats" slot="footer">
            <i class="ti-reload"></i> Atualizado agora
          </div>
        </stats-card>
      </div>
      <div class="col-sm-6 col-md-3">
        <stats-card>
          <div class="icon-big text-center icon-warning" slot="header">
            <i class="ti-cloud"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Ambiente - Umidade</p>
            60%
          </div>
          <div class="stats" slot="footer">
            <i class="ti-reload"></i> Atualizado agora
          </div>
        </stats-card>
      </div>
      <div class="col-sm-6 col-md-3">
        <stats-card>
          <div class="icon-big text-center icon-warning" slot="header">
            <i class="ti-loop"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Planta - Umidade</p>
            80%
          </div>
          <div class="stats" slot="footer">
            <i class="ti-reload"></i> Atualizado agora
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12">
        <chart-card title="Temperatura/Hora" sub-title="Últimas 24 Hours" :chart-data="usersChart.data" :chart-options="usersChart.options">
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
        <chart-card title="Umidade/Hora" sub-title="Últimas 24 Hours" :chart-data="activityChart.data" :chart-options="activityChart.options">
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
export default {
  components: {
    StatsCard,
    ChartCard,
    LocationMap
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      showMap: false,
      lat: "-22.125556",
      lng: "-51.388889",
      status: true,
      statsCards: [
        {
          type: "warning",
          icon: "ti-server",
          title: "Capacity",
          value: "105GB",
          footerText: "Updated now",
          footerIcon: "ti-reload"
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Revenue",
          value: "$1,345",
          footerText: "Last day",
          footerIcon: "ti-calendar"
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "Errors",
          value: "23",
          footerText: "In the last hour",
          footerIcon: "ti-timer"
        },
        {
          type: "info",
          icon: "ti-twitter-alt",
          title: "Followers",
          value: "+45",
          footerText: "Updated now",
          footerIcon: "ti-reload"
        }
      ],
      usersChart: {
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
      },
      activityChart: {
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
      }
    };
  },
  methods: {
    onGoBack() {
      this.$router.push("../towers/list");
    }
  }
};
</script>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
