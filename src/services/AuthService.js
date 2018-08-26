import { auth } from "firebase";

export default {
  getCurrentUserId: () => {
    return auth().currentUser.uid;
  }
};
