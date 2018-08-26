import firebase from "firebase";

export default {
  getPlacesListByOwner: uid => {
    return new Promise(resolve => {
      const collectionRef = firebase.firestore().collection("places");
      let query;

      query = uid ? collectionRef.where("owner", "==", uid) : collectionRef;

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
  getPlaceTowersQnt: placeId => {
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
  }
};
