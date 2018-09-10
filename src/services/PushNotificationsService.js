import firebase from "firebase";

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    console.log("Notification permission granted.");
    const token = await messaging.getToken();
    console.log("token do usuário:", token);
    if (currentToken) {
      sendTokenToServer(currentToken);
      updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log(
        "No Instance ID token available. Request permission to generate one."
      );
      // Show permission UI.
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }

    return token;
  } catch (error) {
    console.error(error);
  }
};

export const saveUserPermissionToken = (uid, token) => {
  console.log(token);
  firebase
    .firestore()
    .collection("users_profile")
    .doc(uid)
    .update({
      push_notification_token: token
    });
};
