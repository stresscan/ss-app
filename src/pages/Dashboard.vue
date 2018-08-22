<template>
  <div>
    <div class="row">
      <div class="col-sm-6 col-md-4 col-xl-4" style="cursor: pointer" v-for="(place, index) in placesList" :key="index" @click="onPlaceClick(place)">
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
          <div class="place" slot="footer">
            <i :class="place.last_uploadIcon"></i> {{place.last_upload}}
          </div>
        </stats-card>
      </div>
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
      placesList: []
    };
  },
  computed: {
    ...mapState({
      isAdmin: state => state.users.user.isAdmin
    }),
    uid: () => firebase.auth().currentUser.uid
  },
  async created() {
    const getPlacesListByUid = uid => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .where("owner", "==", uid)
          .then(querySnapshot => {
            console.log(querySnapshot);
            resolve(null);
          });
      });
    };

    const getAllPlaces = () => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .get()
          .then(placesQuerySnapshot => {
            let places = [];

            placesQuerySnapshot.forEach(placeDocSnapshot => {
              let placeData = Object.assign(placeDocSnapshot.data(), {
                id: placeDocSnapshot.id
              });

              places.push(placeData);
            });

            console.log({ places });
            resolve(places);
          });
      });
    };

    const getPlaceTowersQnt = id => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("places")
          .doc(id)
          .collection("towers")
          .get()
          .then(towersQuerySnapshot => {
            resolve(towersQuerySnapshot.size);
          });
      });
    };

    const getUploadIcon = last_upload => {
      if (last_upload.includes("agora")) {
        return "ti-reload";
      } else if (last_upload.includes("dia")) {
        return "ti-calendar";
      } else if (last_upload.includes("hora")) {
        return "ti-timer";
      }
    };

    getAllPlaces().then(allPlaces => {
      allPlaces.map(place => {
        getPlaceTowersQnt(place.id).then(qnt => {
          this.placesList.push(
            Object.assign(place, {
              qntTowers: qnt,
              last_uploadIcon: getUploadIcon(place.last_upload)
            })
          );
        });
      });
    });

    let placesList = [];

    if (this.isAdmin) {
      this.placesList = await getAllPlaces();
      console.log(placesList);
    } else {
      placesList = await getPlacesListByUid(thid.uid);
    }

    this.placesList = placesList.map(place => {
      console.log({ place });
      return place;
    });

    console.log(this.placesList);
  },
  methods: {
    onPlaceClick(stats) {
      this.$router.push("/dashboard/towers");
    }
  }
};
</script>
<style>
</style>
