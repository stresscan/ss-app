import firebase from "firebase";

// to get  subscriptions information:
// https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

export const askForPermissioToReceiveNotifications = async () => {
  try {
    // Retrieve Firebase Messaging object.
    const messaging = firebase.messaging();

    const fbVAPIDkey =
      "BO6MVrpD0E1vqV4DnOTZZKQ_QV7DLnPzEcYh4cMPoqbjnZQ-oRex0NRYAccvgggxcby6YThrlmvUROeLs0eS3fk";

    messaging.usePublicVapidKey(fbVAPIDkey);

    messaging.onTokenRefresh(function() {
      console.log("onTokenRefresh");
    });

    await messaging.requestPermission();
    console.log("Notificationf permission granted.");

    return await messaging.getToken();
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

export const savePushNotificationEnable = (uid, enable) => {
  console.log("savePushNotificationEnable", uid, enable);

  firebase
    .firestore()
    .collection("users_profile")
    .doc(uid)
    .update({
      push_notifications_enable: enable
    });
};
