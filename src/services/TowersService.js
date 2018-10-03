import firebase from "firebase/app";
import "firebase/firestore";

const _towersRef = placeId =>
  firebase
    .firestore()
    .collection("places")
    .doc(placeId)
    .collection("towers");

const _setDefaultStats = (placeId, towerId) => {
  _towersRef(placeId)
    .doc(towerId)
    .collection("stats")
    .add({
      datetime: 0,
      environment_temperature: 0,
      environment_humidity: 0,
      ground_temperature: 0,
      ground_humidity: 0
    });

  return towerId;
};

export default {
  create: (placeId, tower) => {
    _towersRef(placeId)
      .doc(tower.id)
      .set(delete tower.id)
      .then(() => _setDefaultStats(placeId, newTower.id));
  },
  list: (placeId, includeDisables) => {
    const collectionRef = _placesRef.doc(placeId).collection("towers");

    let query = collectionRef;

    if (!includeDisables) {
      query = query.where("disabled", "==", false);
    }

    return new Promise(resolve => {
      query.get().then(towersQuerySnapshot => {
        resolve(towersQuerySnapshot.size);
      });
    });
  },
  get: async (placeId, towerId) => {
    _towersRef(placeId)
      .doc(towerId)
      .get()
      .then(doc => Object.assign({ id: doc.id }, doc.data()));
  },
  update: async (placeId, tower) => {
    _towersRef(placeId)
      .doc(tower.id)
      .update(delete tower.id);
  },
  getLastStats: (placeId, towerId) => {
    _towersRef(placeId)
      .doc(towerId)
      .collection("stats")
      .orderBy("datetime", "desc")
      .limit(1)
      .get()
      .then(querySnapshot => {
        let last_stat;

        querySnapshot.forEach(doc => {
          last_stat = doc.data();
        });

        return last_stat || {};
      });
  }
};
