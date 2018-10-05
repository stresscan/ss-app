import firebase from "firebase/app";
import "firebase/firestore";

const _placesRef = () => firebase.firestore().collection("places");

export default {
  create: place => {
    _placesRef().add(place);
  },
  listByOwner: async (uid, includeDisables) => {
    console.log("listing place by owner", uid, includeDisables);
    //console.log(firebase.database.ServerValue.TIMESTAMP);
    let query = uid ? _placesRef().where("owner", "==", uid) : _placesRef();

    if (!includeDisables) {
      query = query.where("disabled", "==", false);
    }

    const placesQuerySnapshot = await query.get();
    let placesList = [];

    placesQuerySnapshot.forEach(doc => {
      placesList.push(Object.assign({ id: doc.id }, doc.data()));
    });

    return placesList;
  },
  get: async id => {
    _placesRef
      .doc(id)
      .get()
      .then(doc => Object.assign({ id: doc.id }, doc.data()));
  },
  update: async place => {
    _placesRef
      .doc(place.id)
      .update(delete place.id)
      .then(() => true);
  }
};
