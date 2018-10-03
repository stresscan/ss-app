import firebase from "firebase/app";
import "firebase/firestore";

const _alertsRef = (placeId, towerId) =>
  firebase
    .firestore()
    .collection("places")
    .doc(placeId)
    .collection("towers")
    .doc(towerId)
    .collection("alerts");

export default {
  create: (placeId, towerId, newAlert) => {
    _alertsRef(placeId, towerId).add(newAlert);
  },
  list: async (placeId, towerId) => {
    _alertsRef(placeId, towerId)
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
    _alertsRef(placeId, towerId)
      .doc(alert.id)
      .update({
        metric: alert.metric,
        for: alert.for,
        when: alert.when,
        value: alert.value
      });
  },
  get: (placeId, towerId, id) => {
    _alertsRef(placeId, towerId)
      .doc(id)
      .get()
      .then(doc => {
        return Object.assign({ id: doc.id }, doc.data());
      });
  },
  delete: (placeId, towerId, id) => {
    _alertsRef(placeId, towerId)
      .doc(id)
      .delete();
  }
};
