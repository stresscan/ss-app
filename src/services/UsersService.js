import firebase from "firebase";

export default {
  getImageUrl: (uid, fileName) => {
    return new Promise(resolve => {
      firebase
        .storage()
        .ref(`${uid}/${fileName}`)
        .getDownloadURL()
        .then(url => resolve(url))
        .catch(e => {
          console.log(`get img ${uid}/${fileName} error ${e.message}`);

          // fallback to get default image..
          firebase
            .storage()
            .ref(`default/${fileName}`)
            .getDownloadURL()
            .then(url => resolve(url))
            .catch(e =>
              console.log(`get img default/${fileName} error ${e.message}`)
            );
        });
    });
  }
};
