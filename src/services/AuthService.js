import firebase from "firebase/app";
import "firebase/auth";

console.log("auth service");

const _auth = () => firebase.auth();

export default {
  getCurrentUser: async () => _auth.currentUser,
  getCurrentUserObservable: async () => {
    _auth().onAuthStateChanged(fbuser => {
      return fbuser;
    });
  },
  signInWithEmailAndPassword: async (email, password) => {
    _auth()
      .signInWithEmailAndPassword(email, password)
      .then(userSnapshot => {
        return userSnapshot.user;
      });
  },
  signOut: async () => _auth().signOut(),
  createUserWithEmailAndPassword: async (email, password) =>
    _auth().createUserWithEmailAndPassword(email, password),
  updateUser: (firebaseCreatedUser, data) => {
    firebaseCreatedUser.user.updateProfile(data);
  },
  sendPasswordResetEmail: email => {
    _auth().languageCode = "pt-br";
    return _auth().sendPasswordResetEmail(email);
  }
};
