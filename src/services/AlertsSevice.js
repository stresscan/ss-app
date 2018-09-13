import firebase from "firebase";

export default {
  getAlertData: (placeId, towerId, notId) => {
    const ref = firebase
      .firestore()
      .collection("places")
      .doc(placeId)
      .collection("towers")
      .doc(towerId)
      .collection("alerts")
      .doc(notId);

    return new Promise(resolve => {
      ref.get().then(doc => {
        resolve(Object.assign(doc.data(), { id: doc.id }));
      });
    });
  }
};
