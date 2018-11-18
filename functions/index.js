const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotificationOnAddNewTowerStats = functions.firestore
  .document("places/{placeId}/towers/{towerId}/stats/{statsId}")
  .onCreate((snap, context) => {
    const newStats = snap.data();
    const place = context.params.placeId;
    const tower = context.params.towerId;

    const towerDocRef = admin
      .firestore()
      .collection("places")
      .doc(place)
      .collection("towers")
      .doc(tower);

    towerDocRef
      .collection("alerts")
      .where("enabled", "==", true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const alert = doc.data();
          const newValue = newStats[`${alert.for}_${alert.metric}`];
          const toHigh = alert.when.includes("high") && newValue > alert.value;
          const toLow = alert.when.includes("low") && newValue < alert.value;

          if (toHigh || toLow) {
            console.log({ toLow, toHigh });
            sendPushNotification(place, tower, alert, newStats.datetime);
          }
        });

        return true;
      })
      .catch(e => console.log(e.message));

    const sendPushNotification = (placeId, towerId, alert, datetime) => {
      console.log("enviar notification");
      const msg = `${
        alert.metric === "temperature" ? "Temperatura" : "Umidade"
      } ${alert.for === "environment" ? "do ambiente" : "da planta"} está ${
        alert.when === "high" ? "maior" : "menor"
      } que ${alert.value}`;

      const url = "https://app.stresscan.com";
      const route = `/dashboard/index/places/${placeId}/tower/${towerId}/details`;
      const icon = "https://app.stresscan.com/img/logo.3cc98cff.png";

      admin
        .firestore()
        .collection("places")
        .doc(placeId)
        .get()
        .then(placeDoc => {
          admin
            .firestore()
            .collection("users_profile")
            .doc(placeDoc.data().owner)
            .get()
            .then(userDoc => {
              const tokens = userDoc.data().push_notifications_tokens || [];
              console.log({ tokens });

              if (tokens && userDoc.data().push_notifications_enable) {
                tokens.forEach(token => {
                  console.log({ token });
                  console.log("enviando push", {
                    title: "Stresscan",
                    body: `${msg} na torre ${towerId.substring(0, 8)}`,
                    click_action: url + route,
                    icon
                  });

                  admin.messaging().sendToDevice(token, {
                    notification: {
                      title: "Stresscan",
                      body: `${msg} na torre ${towerId.substring(0, 8)}`,
                      click_action: url + route,
                      icon
                    }
                  });

                  console.log("push enviado");
                });
              }

              console.log("armazenando notification", {
                msg,
                route,
                datetime,
                owner: userDoc.id,
                place,
                tower
              });

              admin
                .firestore()
                .collection("notifications")
                .add({
                  msg,
                  route,
                  datetime,
                  owner: userDoc.id,
                  place,
                  tower
                });

              console.log("notificacao armazenada");

              return true;
            })
            .catch(e => console.log(e.message));

          return true;
        })
        .catch(e => console.log(e.message));
    };

    return true;
  });
