import firebase from "firebase/app";
import "firebase/firestore";

const _clientsRef = () =>
  firebase
    .firestore()
    .collection("users_profile")
    .where("isAdmin", "==", false);

export default {
  list: async () => {
    //return new Promise(resolve => {
    _clientsRef()
      .get()
      .then(clientsQuerySnapshot => {
        let clients = [];

        clientsQuerySnapshot.forEach(clientDocSnapshot => {
          let clientData = Object.assign(clientDocSnapshot.data(), {
            id: clientDocSnapshot.id
          });

          clients.push(clientData);
        });

        //resolve(clients);
        return clients;
      })
      .catch(e => {
        throw new Error(e.message);
      });
    //});
  },
  get: async id => {
    _clientsRef()
      .doc(id)
      .get()
      .then(doc => {
        return Object.assign({ id: doc.id }, doc.data());
      });
  }
};