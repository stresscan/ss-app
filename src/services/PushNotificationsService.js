import firebase from "firebase";

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    console.log("Notificationf permission granted.");
    const token = await messaging.getToken();
    console.log("token do usuário:", token);

    return token;
  } catch (error) {
    console.error(error);
  }
};

export const saveUserPermissionToken = (uid, token) => {
  console.log("saveUserPermissionToken", token);

  const docRef = firebase
    .firestore()
    .collection("users_profile")
    .doc(uid);

  docRef.get().then(user => {
    const tokens = (user.data().push_notifications_tokens || []).filter(
      item => item !== token
    );
    tokens.push(token);
    docRef.update({
      push_notifications_tokens: tokens
    });
  });
};
