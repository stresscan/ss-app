import firebase from "firebase/app";
import "firebase/firestore";

const _errorLogsRef = () => firebase.firestore().collection("error_logs");

export default {
  logError: (datetime, error_message, page, func, logged_user) => {
    return new Promise(resolve => {
      _errorLogsRef()
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
