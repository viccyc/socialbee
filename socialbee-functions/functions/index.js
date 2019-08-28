const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

// using express to figure out the apis
app.get('/buzzes', (req, res) => {
    admin
        .firestore()
        .collection('buzzes')
        .get()
        .then((data) => {
            let buzzes = [];
            data.forEach((doc) => {
                buzzes.push({
                    buzzId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(buzzes);
        })
        .catch((err) => console.error(err));
});

app.post('/buzz', (req, res) => {
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

// using firebase Cloud Functions - before express was installed
// exports.getBuzzes = functions.https.onRequest((req, res) => {
//   admin
//     .firestore()
//     .collection('buzzes')
//     .get()
//     .then((data) => {
//       let buzzes = [];
//       data.forEach((doc) => {
//         buzzes.push(doc.data());
//       });
//       return res.json(buzzes);
//     })
//     .catch((err) => console.error(err));
// });
//
// exports.createBuzz = functions.https.onRequest((req, res) => {
//     if(req.method !== 'POST') {
//         return res.status(400).json({ error: 'Method not allowed'});
//     }
//     const newBuzz = {
//       body: req.body.body,
//       userHandle: req.body.userHandle,
//       createdAt: admin.firestore.Timestamp.fromDate(new Date())
//     };
//
//   admin.firestore()
//     .collection('buzzes')
//     .add(newBuzz)
//     .then((doc) => {
//       res.json({ message: `document ${doc.id} created successfully` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: `something went wrong` });
//       console.error(err);
//     })
// });

exports.api = functions.https.onRequest(app);
