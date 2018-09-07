import firebase from "firebase";

export default {
  logError: (datetime, error_message, page, func, logged_user) => {
    return new Promise(resolve => {
      firebase
        .firestore()
        .collection("error_logs")
        .add({
          datetime,
          error_message,
          page,
          func,
          logged_user
        })
        .then(doc => resolve(doc));
    });
  }
};
