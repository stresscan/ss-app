import firebase from "firebase/app";
import "firebase/firestore";

const placesRef = firebase.firestore().collection("places");

export default {
  create: (placeId, towerId, newAlert) => {
    placesRef
      .doc(placeId)
      .collection("towers")
      .doc(towerId)
      .collection("alerts")
      .add(newAlert);
  },
  list: async (placeId, towerId) => {
    placesRef
      .doc(placeId)
      .collection("towers")
      .doc(towerId)
      .collection("alerts")
      .get()
      .then(querySnapshot => {
        let list = [];
        querySnapshot.forEach(doc => {
          list.push(Object.assign({ id: doc.id }, doc.data()));
        });

        return list;
      });
  },
  update: (placeId, towerId, alert) => {
    placesRef
      .doc(placeId)
      .collection("towers")
      .doc(towerId)
      .collection("alerts")
      .doc(alert.id)
      .update({
        metric: alert.metric,
        for: alert.for,
        when: alert.when,
        value: alert.value
      });
  },
  get: (placeId, towerId, id) => {
    placesRef
      .doc(placeId)
      .collection("towers")
      .doc(towerId)
      .collection("alerts")
      .doc(id)
      .get()
      .then(doc => {
        return Object.assign({ id: doc.id }, doc.data());
      });
  },
  delete: (placeId, towerId, id) => {
    placesRef
      .doc(placeId)
      .collection("towers")
      .doc(towerId)
      .collection("alerts")
      .doc(id)
      .delete();
  }
};
