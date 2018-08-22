<template>
  <div>
    <div class="row">
      <div class="col-sm-6 col-md-4 col-xl-4" style="cursor: pointer" v-for="place in placesList" :key="place.name" @click="onPlaceClick(place)">
        <stats-card :status="place.status == 'online'">
          <div class="card-icon icon-xbig text-center icon-success" slot="header">
            <div>
              <i class="ti-location-pin"></i>
            </div>
          </div>
          <div class="numbers" slot="content">
            <p>
              {{place.title}}
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
        const collectionRef = firebase.firestore().collection("places");
        collectionRef.get().then(querySnapshot => {
          let result = [];
          querySnapshot.forEach(docSnapshot => {
            let place = docSnapshot.data();
            Object.assign(place, { id: docSnapshot.id });

            collectionRef
              .doc(place.id)
              .collection("towers")
              .get()
              .then(querySnapshot => {
                Object.assign(place, { qntTowers: querySnapshot.size });
                console.log(place);
                result.push(place);
              });
          });

          resolve(result);
        });
      });
    };

    this.placesList = await getAllPlaces();
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
