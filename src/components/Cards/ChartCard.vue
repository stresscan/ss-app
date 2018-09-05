<template>
  <card :cardBodyNegativeTop="cardBodyNegativeTop">
    <template slot="header">
      <h4 v-if="$slots.title || title" class="card-title" :class="{'text-center': centerTitle}">
        <slot name="title">
          {{title}}
        </slot>
      </h4>
      <p class="card-category" :class="{'text-center': centerTitle}">
        <slot name="subTitle">
          {{subTitle}}
        </slot>
      </p>
    </template>
    <div>
      <div :id="chartId" class="ct-chart"></div>
      <div class="footer">
        <div class="chart-legend">
          <slot name="legend"></slot>
        </div>
        <hr>
        <div class="stats">
          <slot name="footer"></slot>
        </div>
        <div class="pull-right">
        </div>
      </div>
    </div>

  </card>
</template>
<script>
import Card from "./Card.vue";
export default {
  name: "chart-card",
  components: {
    Card
  },
  props: {
    footerText: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    },
    centerTitle: {
      type: Boolean,
      default: false
    },
    chartType: {
      type: String,
      default: "Line" // Line | Pie | Bar
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {};
      }
    },
    chartResponsiveOptions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [],
          series: []
        };
      }
    },
    cardBodyNegativeTop: Boolean
  },
  data() {
    return {
      chartId: "no-id"
    };
  },
  methods: {
    /***
     * Initializes the chart by merging the chart options sent via props and the default chart options
     */
    initChart(Chartist) {
      const chartIdQuery = `#${this.chartId}`;
      Chartist[this.chartType](
        chartIdQuery,
        this.chartData,
        this.chartOptions,
        this.chartResponsiveOptions
      );
    },
    /***
     * Assigns a random id to the chart
     */
    updateChartId() {
      const currentTime = new Date().getTime().toString();
      const randomInt = this.getRandomInt(0, currentTime);
      this.chartId = `div_${randomInt}`;
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  mounted() {
    this.updateChartId();
    import("chartist").then(Chartist => {
      let ChartistLib = Chartist.default || Chartist;
      this.$nextTick(() => {
        this.initChart(ChartistLib);
      });
    });

    this.$nextTick(() => {
      setTimeout(() => {
        const ctPoints = document.querySelectorAll(
          ".chart-temperature .ct-point"
        );

        const length = ctPoints.length;

        for (let i = 0; i < length; i++) {
          ctPoints[i].onmouseover = () => {
            document.querySelector(".chart-tooltip").style.opacity = 1;
          };

          ctPoints[i].onmouseout = () => {
            document.querySelector(".chart-tooltip").style.opacity = 0;
          };
        }

        const ctPointsHumidity = document.querySelectorAll(
          ".chart-humidity .ct-point"
        );

        const lengthHumidity = ctPointsHumidity.length;

        for (let i = 0; i < lengthHumidity; i++) {
          ctPointsHumidity[i].onmouseover = () => {
            document.querySelector(".chart-tooltip-humidity").style.opacity = 1;
          };

          ctPointsHumidity[i].onmouseout = () => {
            document.querySelector(".chart-tooltip-humidity").style.opacity = 0;
          };
        }
      }, 1000);
    });
  }
};
</script>
<style>
.ct-point:hover {
  stroke-width: 15px !important;
}

.chart-tooltip {
  border-radius: 6px;
  position: relative;
  width: max-content;
  padding: 4px 8px;
  color: #fff;
  background: #333;
  transition: all 0.25s;
  height: 29px;
  opacity: 0;
}

.chart-tooltip br,
.chart-tooltip-humidity br {
  display: none;
}

.chart-tooltip-humidity {
  border-radius: 6px;
  position: relative;
  width: max-content;
  padding: 4px 8px;
  color: #fff;
  background: #333;
  transition: all 0.25s;
  height: 29px;
  opacity: 0;
}
</style>
