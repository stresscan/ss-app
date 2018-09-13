const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addLastTowerStatsData = functions.firestore
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
      .update({
        last_stats: newStats
      })
      .then(() => {
        return true;
      })
      .catch(e => console.log(e.message));

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
            sendPushNotification(place, tower, alert);
          }
        });

        return true;
      })
      .catch(e => console.log(e.message));

    const sendPushNotification = (placeId, towerId, alert) => {
      const body = `${
        alert.metric === "temperature" ? "Temperatura" : "Umidade"
      } ${alert.for === "environment" ? "do ambiente" : "da planta"} está ${
        alert.when === "high" ? "maior" : "menor"
      } que ${alert.value} na torre ${towerId.substring(0, 8)}`;

      const url = "http://localhost:3014/dashboard/index/places/";
      const click_action = url + placeId + "/tower/" + towerId + "/details";
      const icon =
        "http://res.cloudinary.com/dwtuxv53y/image/upload/v1536530915/face-1_thhyxw.jpg";

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
              const token = userDoc.data().push_notifications_token;

              if (token) {
                admin.messaging().sendToDevice(token, {
                  notification: {
                    title: "Stresscan",
                    body,
                    click_action,
                    icon
                  }
                });
              }

              admin
                .firestore()
                .collection("notifications")
                .add({
                  body,
                  click_action,
                  ready: false,
                  datetime: Date.now(),
                  owner: userDoc.id
                });

              return true;
            })
            .catch(e => console.log(e.message));

          return true;
        })
        .catch(e => console.log(e.message));
    };

    return true;
  });
