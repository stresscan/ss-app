import firebase from "firebase/app";
import "firebase/messaging";

// to get  subscriptions information:
// https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

const messaging = firebase.messaging();

console.log("instaciado o objeto messaging");

const onTokenRefresh = () => {
  messaging.onTokenRefresh(function() {
    messaging
      .getToken()
      .then(function(refreshedToken) {
        console.log("Token refreshed.");
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        // ...
      })
      .catch(function(err) {
        console.log("Unable to retrieve refreshed token ", err);
        showToken("Unable to retrieve refreshed token ", err);
      });
  });

  console.log("configurado ontokenrefresh()");
};

const onMessage = () => {
  messaging.onMessage(payload => {
    // Quando seu app estiver em primeiro plano (o usuário está visualizando a página da Web)
    console.log("Message received. ", payload);
  });

  console.log("configurado onmessage()");
};

export default {
  authorizeNotification: () => {
    console.log("requesting permission");

    messaging.usePublicVapidKey(
      "BIX_wCrbMqbVZRfupoheB4E236rjwCGuE0bqzIS83dKriuZqG6SyCJM3H1n2L7Y8nQo1IsNn9pzBbjzuUYbPaM4"
    );
    console.log("configurado PublicVapidKey");

    messaging
      .requestPermission()
      .then(function(auth) {
        console.log("Notification permission granted.");
        console.log({ auth });
        this.getAuthorizationToken();
      })
      .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
      });
  },
  getAuthorizationToken: () => {
    console.log("getting authorization token");

    messaging
      .getToken()
      .then(function(currentToken) {
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
      })
      .catch(function(err) {
        console.log("An error occurred while retrieving token. ", err);
        showToken("Error retrieving Instance ID token. ", err);
        setTokenSentToServer(false);
      });

    onTokenRefresh();
    onMessage();
  },
  askForPermissioToReceiveNotifications: async () => {
    try {
      const messaging = firebase.messaging();
      await messaging.requestPermission();
      const token = await messaging.getToken();
      console.log({ token });

      return token;
    } catch (error) {
      console.error(error);
    }
  },
  updateUserPermissionToken: (uid, token) => {
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
  },
  updatePushNotificationEnable: (uid, enable) => {
    firebase
      .firestore()
      .collection("users_profile")
      .doc(uid)
      .update({
        push_notifications_enable: enable
      });
  }
};
