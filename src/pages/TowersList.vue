<template>
  <div>
    <div class="row">
      <div class="col-12">
        <card>
          <div slot="raw-content" style="padding: 20px">
            <span class="status online">online</span>
            <span class="status offline">offline</span>
            Fazenda #1
            <br />Presidente Prudente/SP
            <a style="display: block; margin-top: 10px" href="#" onclick="javascript:history.go(-1)">
              <i class="ti-arrow-left"></i> Voltar
            </a>
          </div>
        </card>
      </div>
    </div>

    <!--Stats cards - Places-->
    <div class="row">
      <div class="col-sm-6 col-md-4 col-xl-4" style="cursor: pointer" v-for="stats in statsCards" :key="stats.title" @click="onTowerClick(stats)">
        <stats-card :status="stats.status">
          <div class="card-icon icon-xbig text-center" :class="`icon-${stats.type}`" slot="header">
            <div :class="{'offline-color': !stats.status}">
              <i class="ti-signal"></i>
            </div>
          </div>
          <div class="numbers" slot="content">
            <p>
              <span class="status online" v-if="stats.status">online</span>
              <span class="status offline" v-else>offline</span>{{stats.title}}
            </p>
            <p class="small-info">{{stats.culture}}</p>
            <p class="big-info">
              {{stats.environmentTemperature}}°
            </p>
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Card, StatsCard, ChartCard } from "@/components/index";
import Chartist from "chartist";
export default {
  components: {
    Card,
    StatsCard,
    ChartCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      statsCards: [
        {
          id: 1,
          type: "success",
          icon: "ti-location-pin",
          title: "Torre #1",
          culture: "Laranja",
          environmentTemperature: 21,
          value: "105GB",
          footerText: "Atualizado agora",
          footerIcon: "ti-reload",
          status: true
        },
        {
          id: 2,
          type: "warning",
          icon: "ti-location-pin",
          title: "Torre #2",
          culture: "Morango",
          environmentTemperature: 23,
          value: "$1,345",
          footerText: "Atualizado há 1 dia",
          footerIcon: "ti-calendar",
          status: false
        },
        {
          id: 2,
          type: "success",
          icon: "ti-location-pin",
          title: "Torre #3",
          culture: "Beterraba",
          environmentTemperature: 21,
          value: "$1,345",
          footerText: "Atualizado há mais de 1 dia",
          footerIcon: "ti-calendar",
          status: false
        },
        {
          id: 3,
          type: "success",
          icon: "ti-location-pin",
          title: "Torre #4",
          culture: "Cana",
          environmentTemperature: 27,
          value: "23",
          footerText: "Atualizado há algumas horas",
          footerIcon: "ti-timer",
          status: true
        },
        {
          id: 4,
          type: "danger",
          icon: "ti-location-pin",
          title: "Torre #5",
          culture: "Alface",
          environmentTemperature: 32,
          value: "+45",
          footerText: "Atualizado há menos de 1 hora",
          footerIcon: "ti-reload",
          status: true
        }
      ],
      usersChart: {
        data: {
          labels: [
            "9:00AM",
            "12:00AM",
            "3:00PM",
            "6:00PM",
            "9:00PM",
            "12:00PM",
            "3:00AM",
            "6:00AM"
          ],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        },
        options: {
          low: 0,
          high: 1000,
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
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          series: [
            [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
            [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "245px"
        }
      },
      preferencesChart: {
        data: {
          labels: ["62%", "32%", "6%"],
          series: [62, 32, 6]
        },
        options: {}
      }
    };
  },
  methods: {
    onTowerClick(stats) {
      this.$router.push("/tower");
    }
  }
};
</script>
<style>
</style>
