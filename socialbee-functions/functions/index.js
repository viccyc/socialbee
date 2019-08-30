const functions = require('firebase-functions');
const app = require ('express')();
// const { admin, db } = require('./util/admin');

const fireBaseAuth = require('./util/FBAuth');

const { getAllBuzzes, postOneBuzz } = require('./handlers/buzzes');
const { signUpUser, loginUser } = require('./handlers/users');

// const firebase = require('firebase');
// firebase.initializeApp(config);
let token, userId;

// buzz routes
// using express to figure out the apis
app.get('/buzzes', getAllBuzzes);

// use auth middleware so that we restrict who posts a buzz

app.post('/buzz', fireBaseAuth, postOneBuzz);

// User routes
// Signup route
app.post('/signup', signUpUser);

// login route
app.post('/login', loginUser);

exports.api = functions.https.onRequest(app);
