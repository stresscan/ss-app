import firebase from "firebase";

// to get  subscriptions information:
// https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log({ token });

    return token;
  } catch (error) {
    console.error(error);
  }
};

export const saveUserPermissionToken = (uid, token) => {
  const docRef = firebase
    .firestore()
    .collection("users_profile")
    .doc(uid);

  console.log("saving", { uid });

  docRef.get().then(user => {
    const tokens = (user.data().push_notifications_tokens || []).filter(
      item => item !== token
    );

    tokens.push(token);

    console.log({ tokens });

    docRef.update({
      push_notifications_tokens: tokens
    });
  });
};

export const savePushNotificationEnable = (uid, enable) => {
  firebase
    .firestore()
    .collection("users_profile")
    .doc(uid)
    .update({
      push_notifications_enable: enable
    });
};
