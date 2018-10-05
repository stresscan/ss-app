import firebase from "firebase/app";
import "firebase/firestore";

const _usersRef = () => firebase.firestore().collection("users_profile");

export default {
  create: profile =>
    _usersRef()
      .doc(profile.uid)
      .set(delete profile.uid),
  list: async () => {
    _usersRef()
      .get()
      .then(querySnapshot => {
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
  get: async uid => {
    const userDoc = await _usersRef()
      .doc(uid)
      .get();

    if (!userDoc.exists) return null;
    return Object.assign({ uid: userDoc.id }, userDoc.data());
  },
  getByUsername: username => {
    _usersRef()
      .where("username", "==", username)
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          users.push(Object.assign({ uid: doc.id }, doc.data));
        });
        return users;
      });
  },
  getByEmail: email => {
    _usersRef()
      .where("email", "==", email)
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          users.push(Object.assign({ uid: doc.id }, doc.data));
        });
        return users;
      });
  },
  update: userProfile =>
    _usersRef()
      .doc(userProfile.uid)
      .update(delete userProfile.uid)
};
