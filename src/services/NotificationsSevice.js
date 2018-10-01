import firebase from "firebase/app";
import "firebase/firestore";

const notificationsRef = firebase.firestore().collection("notifications");

export default {
  delete: id => {
    notificationsRef.doc(id).delete();
  }
};
