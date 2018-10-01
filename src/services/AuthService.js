import firebase from "firebase/app";
import "firebase/auth";

const _auth = firebase.auth();

export default {
  getCurrentUser: async () => _auth.currentUser,
  signOut: async () => _auth.signOut(),
  createUserWithEmailAndPassword: async (email, password) =>
    _auth.createUserWithEmailAndPassword(email, password),
  updateUser: (createdUser, data) => {
    createdUser.user.updateProfile(data);
  }
};
