import firebase from "firebase/app";
import "firebase/firestore";

const _placesRef = firebase.firestore().collection("places");

export default {
  create: place => {
    _placesRef.add(place);
  },
  listByOwner: async (uid, includeDisables) => {
    //console.log(firebase.database.ServerValue.TIMESTAMP);
    const collectionRef = firebase.firestore().collection("places");
    let query = collectionRef;

    query = uid ? query.where("owner", "==", uid) : query;

    if (!includeDisables) {
      query = query.where("disabled", "==", false);
    }

    //return new Promise(resolve => {
    query.get().then(placesQuerySnapshot => {
      let places = [];

      placesQuerySnapshot.forEach(doc => {
        places.push(
          Object.assign(doc.data(), {
            id: doc.id
          })
        );
      });

      return places;
    });
    // });
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
