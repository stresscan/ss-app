<template>
  <div>
    <p-button v-if="isAdmin" type="success" class="mg-bt-md" round @click.native.prevent="onNewPlace">
      <i class="ti-plus"></i> Adicionar Local
    </p-button>
    <div class="row">
      <div v-if="loading" class="ss-inline-spinner el-center mg-tp-md mg-bt-md"></div>
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
            <div class="stats last-upload" slot="footer">
              <i :class="place.last_uploadIcon"></i> {{place.last_upload}}
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
import firebase from "firebase";

export default {
  components: {
    StatsCard,
    ChartCard
  },
  data() {
    return {
      loading: true,
      noPlacesFound: false,
      placesList: []
    };
  },
  computed: {
    ...mapState({
      isAdmin: state => state.users.user.isAdmin
    }),
    uid: () => firebase.auth().currentUser.uid
  },
  created() {
    const getPlacesList = uid => {
      return new Promise(resolve => {
        const collectionRef = firebase.firestore().collection("places");
        let query;

        if (uid) {
          query = collectionRef.where("owner", "==", uid).get();
        } else {
          query = collectionRef.get();
        }

        query.then(placesQuerySnapshot => {
          let places = [];

          placesQuerySnapshot.forEach(placeDocSnapshot => {
            let placeData = Object.assign(placeDocSnapshot.data(), {
              id: placeDocSnapshot.id
            });

            places.push(placeData);
          });

          resolve(places);
        });
      });
    };

    const getPlaceTowersQnt = placeId => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(placeId)
          .collection("towers")
          .get()
          .then(towersQuerySnapshot => {
            resolve(towersQuerySnapshot.size);
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

    getPlacesList(this.isAdmin ? null : this.uid).then(placesList => {
      this.loading = false;

      if (placesList.length == 0) {
        this.noPlacesFound = true;
      } else {
        placesList.map(place => {
          getPlaceTowersQnt(place.id).then(qnt => {
            this.placesList.push(
              Object.assign(place, {
                qntTowers: qnt,
                last_uploadIcon: getUploadIcon(place.last_upload)
              })
            );
          });
        });
      }
    });
  },
  methods: {
    onPlaceClick(place) {
      this.$router.replace(`${place.id}/towers`);
    },
    onNewPlace() {
      if (this.isAdmin) {
        this.$router.replace(`create`);
      }
    }
  }
};
</script>
<style>
</style>
