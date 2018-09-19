import firebase from "firebase";

export default {
  saveAdd2HomeScreenUserChoice: (uid, choice) => {
    firebase
      .firestore()
      .collection("users_profile")
      .doc(uid)
      .update({
        add2hsChoice: choice
      });
  }
};
