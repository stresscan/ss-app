import firebase from "firebase/app";
import "firebase/firestore";

const _storage = firebase.storage();
const _usersRef = firebase.firestore().collection("users_profile");

export default {
  create: profile => _usersRef.doc(profile.uid).set(delete profile.uid),
  list: async () => {
    _usersRef.get().then(querySnapshot => {
      let users = [];
      querySnapshot.forEach(docSnapshot => {
        users.push({
          id: docSnapshot.id,
          nome: `${docSnapshot.data().name} ${docSnapshot.data().surname}`,
          nivel: docSnapshot.data().isAdmin ? "admin" : "cliente",
          username: docSnapshot.data().username,
          status: docSnapshot.data().disabled ? "desativado" : "ativado"
        });
      });

      return users;
    });
  },
  get: id => _usersRef.doc(id).get(),
  getByUsername: username => {
    _usersRef
      .where("username", "==", username)
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          users.push(Object.assign({ id: doc.id }, doc.data));
        });
        return users;
      });
  },
  getByEmail: email => {
    _usersRef
      .where("email", "==", email)
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          users.push(Object.assign({ id: doc.id }, doc.data));
        });
        return users;
      });
  },
  update: userProfile =>
    _usersRef.doc(userProfile.id).update(delete userProfile.id),
  getImageUrl: (uid, fileName) => {
    // TODO: refactor
    return new Promise((resolve, reject) => {
      _storage
        .ref(`${uid}/${fileName}`)
        .getDownloadURL()
        .then(url => resolve(url))
        .catch(e => {
          console.log(`get img ${uid}/${fileName} error ${e.message}`);

          // fallback to get default image..
          firebase
            .storage()
            .ref(`default/${fileName}`)
            .getDownloadURL()
            .then(url => resolve(url))
            .catch(e => {
              console.log(`get img default/${fileName} error ${e.message}`);
              reject();
            });
        });
    });
  }
};
