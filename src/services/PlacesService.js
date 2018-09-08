import firebase from "firebase";

export default {
  getPlacesListByOwner: (uid, includeDisables) => {
    const collectionRef = firebase.firestore().collection("places");
    let query = collectionRef;

    query = uid ? query.where("owner", "==", uid) : query;

    if (!includeDisables) {
      query = query.where("disabled", "==", false);
    }

    return new Promise(resolve => {
      query.get().then(placesQuerySnapshot => {
        let places = [];

        placesQuerySnapshot.forEach(doc => {
          places.push(
            Object.assign(doc.data(), {
              id: doc.id
            })
          );
        });

        resolve(places);
      });
    });
  },
  getPlaceTowersQnt: (placeId, includeDisables) => {
    const collectionRef = firebase
      .firestore()
      .collection("places")
      .doc(placeId)
      .collection("towers");

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
  getClientsList: () => {
    return new Promise(resolve => {
      firebase
        .firestore()
        .collection("users_profile")
        .where("isAdmin", "==", false)
        .get()
        .then(clientsQuerySnapshot => {
          let clients = [];

          clientsQuerySnapshot.forEach(doc => {
            clients.push(
              Object.assign(doc.data(), {
                id: doc.id
              })
            );
          });

          resolve(clients);
        });
    });
  },
  getTowerData: (placeId, towerId) => {
    const ref = firebase
      .firestore()
      .collection("places")
      .doc(placeId)
      .collection("towers")
      .doc(towerId);

    return new Promise(resolve => {
      ref.get().then(doc => {
        resolve(Object.assign(doc.data(), { id: doc.id }));
      });
    });
  }
};
