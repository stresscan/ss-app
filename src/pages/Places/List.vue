<template>
  <div>
    <div v-if="isAdmin" class="mg-bt-md">
      <h3>Filtrar por Cliente</h3>
      <select @change="onChangeClient" id="client" class="form-control" v-model="clientSelect">
        <option disabled value="" v-if="loadingClientList">Aguarde...</option>
        <option value="">Todos</option>
        <option v-for="client in clientsList" :key="client.id" v-bind:value="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>
    <p-button v-if="isAdmin && !loadingPlacesList" type="success" class="mg-bt-md" round @click.native.prevent="onNewPlace">
      <i class="ti-plus"></i> Adicionar Local
    </p-button>
    <div class="row">
      <div v-if="loadingPlacesList" class="ss-inline-spinner el-center mg-tp-md mg-bt-md"></div>
      <template v-else>
        <div v-if="noPlacesFound" class="mg-lf-sm text-info">
          Nenhum local cadastrado para essa conta ainda
        </div>
        <div v-else class="col-sm-6 col-md-4 col-xl-4" style="cursor: pointer" v-for="(place, index) in placesList" :key="index" @click="onPlaceClick(place)">
          <stats-card :status="place.status == 'online'">
            <div class="card-icon icon-xbig text-center icon-success" slot="header">
              <div>
                <i class="ti-location-pin"></i>
              </div>
            </div>
            <div class="numbers" slot="content">
              <p>
                {{place.name}}
              </p>
              <p class="small-info">{{place.city}}/{{place.estate}}</p>
              <span class="big-info">
                {{place.qntTowers}}
                <i class="ti-signal card-icon-tower"></i>
              </span>
            </div>
          </stats-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from "chartist";
import { mapState } from "vuex";
import placeService from "../../services/PlacesService";
import authService from "../../services/AuthService";
import basePage from "../../mixins/BasePage.js";

export default {
  mixins: [basePage],
  components: {
    StatsCard,
    ChartCard
  },
  data() {
    return {
      loadingClientList: true,
      loadingPlacesList: true,
      noPlacesFound: false,
      clientSelect: "",
      clientsList: [],
      placesList: []
    };
  },
  computed: {
    ...mapState({
      isAdmin: state => state.users.user.isAdmin
    }),
    uid: () => authService.getCurrentUserId()
  },
  created() {
    this.getClients();

    this.clientSelect = this.$route.query.clientId
      ? this.$route.query.clientId
      : "";

    this.getPlacesListByOwner(this.isAdmin ? this.clientSelect : this.uid);
  },
  methods: {
    getClients() {
      this.loadingClientList = true;
      placeService.getClientsList().then(list => {
        list.map(item => {
          this.clientsList.push(item);
        });

        this.loadingClientList = false;

        if (this.$route.query.clientId) {
          this.clientSelect = this.$route.query.clientId;
        }
      });
    },
    getPlacesListByOwner(ownerId) {
      this.placesList = [];
      this.loadingPlacesList = true;
      this.noPlacesFound = false;

      if (!ownerId && !this.isAdmin) {
        this.loadingPlacesList = false;
      }
      placeService.getPlacesListByOwner(ownerId).then(placesList => {
        if (placesList.length == 0) {
          this.loadingPlacesList = false;
          this.noPlacesFound = true;
        } else {
          let i;
          const placesListLength = placesList.length;

          for (let i = 0; i < placesListLength; i++) {
            placeService.getPlaceTowersQnt(placesList[i].id).then(qnt => {
              this.placesList.push(
                Object.assign(placesList[i], {
                  qntTowers: qnt
                })
              );

              if (i == placesListLength - 1) {
                this.loadingPlacesList = false;
              }
            });
          }
        }
      });
    },
    onChangeClient() {
      this.getPlacesListByOwner(this.clientSelect);
    },
    onPlaceClick(place) {
      this.$router.replace(`${place.id}/towers/list`);
    },
    onNewPlace() {
      if (this.isAdmin) {
        this.$router.replace(`create?clientId=${this.clientSelect}`);
      }
    }
  }
};
</script>
<style>
</style>
