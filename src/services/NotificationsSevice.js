import firebase from "firebase/app";
import "firebase/firestore";

const _notificationsRef = () =>
  firebase.firestore().collection("notifications");

export default {
  delete: id => {
    _notificationsRef()
      .doc(id)
      .delete();
  }
};
