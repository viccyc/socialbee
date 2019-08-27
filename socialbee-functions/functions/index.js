const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello socialbee!");
});

exports.getBuzzes = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('buzzes')
    .get()
    .then((data) => {
      let buzzes = [];
      data.forEach((doc) => {
        buzzes.push(doc.data());
      });
      return res.json(buzzes);
    })
    .catch((err) => console.error(err));
});

exports.createBuzz = functions.https.onRequest((req, res) => {
  const newBuzz = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin.firestore()
    .collection('buzzes')
    .add(newBuzz)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: `something went wrong` });
      console.error(err);
    })
});