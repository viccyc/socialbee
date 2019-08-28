const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require ('express')();

admin.initializeApp();

const config = {
    apiKey: "AIzaSyDt6CJlDIyjeceHwE98pLz2iyxN1zxMZUQ",
    authDomain: "socialbee-c0ea7.firebaseapp.com",
    databaseURL: "https://socialbee-c0ea7.firebaseio.com",
    projectId: "socialbee-c0ea7",
    storageBucket: "socialbee-c0ea7.appspot.com",
    messagingSenderId: "328498940214",
    appId: "1:328498940214:web:03f5ad7e710805c6"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();
let token, userId;

// using express to figure out the apis
app.get('/buzzes', (req, res) => {
    db
        .collection('buzzes')
        .orderBy('createdAt', 'desc')
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
        createdAt: new Date().toISOString()
    };

    db
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

//Signup route
app.post('/signup', (req, res) => {
   const newUser = {
       email: req.body.email,
       password: req.body.password,
       confirmPassword: req.body.confirmPassword,
       handle: req.body.handle,
   };

   // validate data
   db.doc(`/users/${newUser.handle}`).get()
       .then(doc => {
           if (doc.exists) {
               return res.status(400).json({ handle: `this handle is already taken`});
           } else {
               return firebase
                   .auth()
                   .createUserWithEmailAndPassword(newUser.email, newUser.password);
           }
       })
       .then(data => {
           userId = data.user.uid;
           return data.user.getIdToken();
       })
       .then(idToken => {
           token = idToken;
           const userCredentials = {
               handle: newUser.handle,
               email: newUser.email,
               createdAt: new Date().toISOString(),
               userId
           };
           return db.doc(`/users/${newUser.handle}`).set(userCredentials);
       })
       .then(() => {
           return res.status(201).json({ token });
       })
       .catch(err => {
           console.error(err);
           if (err.code === "auth/email-already-in-use") {
               return res.status(400).json({ email: `Email is already in use`});
           } else {
               return res.status(500).json({ error: err.code });
           }
       })

   // firebase
   //      .auth()
   //      .createUserWithEmailAndPassword(newUser.email, newUser.password)
   //      .then((data) => {
   //          return res
   //              .status(201)
   //              .json({ message: `user ${data.user.uid} signed up successfully` });
   //      })
   //      .catch((err) => {
   //         console.error(err);
   //         return res.status(500).json({ error: err.code });
   //      });
});

exports.api = functions.https.onRequest(app);
