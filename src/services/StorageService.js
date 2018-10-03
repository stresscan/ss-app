import firebase from "firebase/app";
import "firebase/storage";

const _storageRef = () => firebase.storage();

export default {
  uploadFile: (folder, fileName, file) =>
    _storageRef()
      .child(`${folder}/${fileName}`)
      .put(file),
  updateFileMetadata: (fileRef, metadata) =>
    fileRef.ref.updateMetadata(metadata),
  getImageUrl: (uid, fileName) => {
    // TODO: refactor
    return new Promise((resolve, reject) => {
      _storageRef()
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
            .catch(e => {
              console.log(`get img default/${fileName} error ${e.message}`);
              reject();
            });
        });
    });
  }
};
