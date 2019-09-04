const functions = require('firebase-functions');
// using express to figure out the apis
const app = require ('express')();

// use auth middleware so that we restrict who posts a buzz
const fireBaseAuth = require('./util/FBAuth');

const { getAllBuzzes, postOneBuzz } = require('./handlers/buzzes');
const { signUpUser, loginUser, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

// buzz routes
app.get('/buzzes', getAllBuzzes);
app.post('/buzz', fireBaseAuth, postOneBuzz);

// User routes
app.post('/signup', signUpUser);
app.post('/login', loginUser);
app.post('/users/image', fireBaseAuth, uploadImage);
app.post('/user', fireBaseAuth, addUserDetails);
app.get('/user', fireBaseAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
