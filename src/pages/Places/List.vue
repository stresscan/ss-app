<template>
  <div>
    <template v-if="isAdmin()">
      <div class="mg-bt-md">
        <h3>Filtrar por Cliente</h3>
        <select @change="onChangeClient" id="client" class="form-control" v-model="clientSelectValue">
          <option disabled value="" v-if="loadingClientList">Aguarde...</option>
          <option value="">Todos</option>
          <option v-for="client in clientsList" :key="client.id" v-bind:value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>
      <p-button v-if="!loadingPlacesList" type="success" class="mg-bt-md" round @click.native.prevent="onNewPlace">
        <i class="ti-plus"></i> Adicionar Local
      </p-button>
    </template>

    <div class="row">
      <div v-if="loadingPlacesList" class="ss-inline-spinner el-center mg-tp-md mg-bt-md"></div>
      <template v-else>
        <div v-if="noPlacesFound" class="mg-lf-sm text-info">
          <i class="fa fa-close"></i>
          <b>Nenhum local cadastrado para essa conta ainda</b>
        </div>
        <div v-else class="col-sm-6 col-md-4 col-xl-4" style="cursor: pointer" v-for="(place, index) in placesList" :key="index" @click="onPlaceClick(place)">
          <stats-card :disabled="place.disabled">
            <div class="card-icon icon-xbig text-center icon-success" slot="header">
              <div>
                <i class="ti-location-pin"></i>
              </div>
            </div>
            <div class="numbers" slot="content">
              <p>
                <span class="status online" v-if="!place.disabled">online</span>
                <span class="status offline" v-else>offline</span>
                {{place.name}}
              </p>
              <p class="small-info">{{place.location.city}}/{{place.location.estate}}</p>
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
import placeService from "@/services/PlacesService";
import authService from "@/services/AuthService";
import basePage from "@/mixins/BasePage.js";
import authPage from "@/mixins/Auth/AuthenticatedPage.js";
import userIsAdmin from "@/mixins/Auth/UserIsAdmin.js";

export default {
  mixins: [basePage, authPage, userIsAdmin],
  components: {
    StatsCard,
    ChartCard
  },
  data() {
    return {
      loadingClientList: true,
      loadingPlacesList: true,
      noPlacesFound: false,
      clientSelectValue: "",
      clientsList: [],
      placesList: []
    };
  },
  created() {
    if (this.isAdmin()) {
      this.getClientsList();
    }

    this.getPlacesListByOwner(this.isAdmin() ? "" : this.stateUid);
  },
  methods: {
    getClientsList() {
      this.loadingClientList = true;
      placeService.getClientsList().then(list => {
        list.map(item => {
          this.clientsList.push(item);
        });

        this.loadingClientList = false;

        if (this.$route.query.clientId) {
          this.clientSelectValue = this.$route.query.clientId;
        }
      });
    },
    getPlacesListByOwner(ownerId) {
      this.placesList = [];
      this.loadingPlacesList = true;
      this.noPlacesFound = false;

      if (!ownerId && !this.isAdmin()) {
        this.loadingPlacesList = false;
      } else {
        placeService
          .getPlacesListByOwner(ownerId, this.isAdmin())
          .then(placesList => {
            if (placesList.length == 0) {
              this.loadingPlacesList = false;
              this.noPlacesFound = true;
            } else {
              let i;
              const placesListLength = placesList.length;

              for (let i = 0; i < placesListLength; i++) {
                placeService
                  .getPlaceTowersQnt(placesList[i].id, this.isAdmin())
                  .then(qnt => {
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
      }
    },
    onChangeClient() {
      if (this.isAdmin()) {
        this.getPlacesListByOwner(this.clientSelectValue, true);
      }
    },
    onPlaceClick(place) {
      this.$router.replace(`${place.id}/towers/list`);
    },
    onNewPlace() {
      if (this.isAdmin()) {
        this.$router.replace(`create?clientId=${this.clientSelectValue}`);
      }
    }
  }
};
</script>
<style>
</style>
