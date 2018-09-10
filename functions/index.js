const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// exports.addLastTowerStatsData = functions.database
//   .ref("places/{placeId}/towers/{towerId}/stats/{statsId}")
//   .onCreate((snapshot, context) => {
//     // Grab the current value of what was written to the Realtime Database.
//     const original = snapshot.val();
//     console.log({ original });
//     return true;
//   });

exports.addLastTowerStatsData = functions.firestore
  .document("places/{placeId}/towers/{towerId}/stats/{statsId}")
  .onCreate((snap, context) => {
    const newStats = snap.data();

    admin
      .firestore()
      .collection("places")
      .doc(context.params.placeId)
      .collection("towers")
      .doc(context.params.towerId)
      .update({
        last_stats: newStats
      });

    admin
      .messaging()
      .sendToDevice(
        "d754zxinYQs:APA91bHPR2EZF7DNK4AoTrbJLtyqdzHWr3fzfO--wHMV1-7b3l_Wdhdyu28EaKriZN-R1ujB5Fw6bCAyVG22sbPr2XE8vdj6pOdCeq7bfuIzdSGi70VaI0dxaMaxthkP9_FfNfmQnIll",
        {
          notification: {
            title: "Stresscan",
            body:
              "Temperatura do ambiente: " +
              newStats.environmentTemperature +
              " maior que o esperado",
            click_action: "http://localhost:3014/",
            icon:
              "http://res.cloudinary.com/dwtuxv53y/image/upload/v1536530915/face-1_thhyxw.jpg"
          }
        }
      );

    return true;
  });
