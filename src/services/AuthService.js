import firebase from "firebase/app";
import "firebase/auth";

const _auth = () => firebase.auth();

export default {
  getCurrentUser: () => _auth().currentUser,
  getCurrentUserObservable: () => {
    return new Promise(resolve => {
      _auth().onAuthStateChanged(fbuser => {
        resolve(fbuser);
      });
    });
  },
  signInWithEmailAndPassword: async (email, password) => {
    const userSnapshot = await _auth().signInWithEmailAndPassword(
      email,
      password
    );

    return userSnapshot.user;
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
