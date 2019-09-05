const functions = require('firebase-functions');
// using express to figure out the apis
const app = require ('express')();

// use auth middleware so that we restrict who posts a buzz
const fireBaseAuth = require('./util/FBAuth');

const { getAllBuzzes,
    postOneBuzz,
    getBuzzById,
    addBuzzComment,
    likeBuzz,
    unlikeBuzz,
    deleteBuzz } = require('./handlers/buzzes');
const { signUpUser,
    loginUser,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser } = require('./handlers/users');

// buzz routes
app.get('/buzzes', getAllBuzzes);
app.post('/buzz', fireBaseAuth, postOneBuzz);
app.get('/buzz/:buzzId', getBuzzById);
app.post('/buzz/:buzzId/comment', fireBaseAuth, addBuzzComment);
app.get('/buzz/:buzzId/like', fireBaseAuth, likeBuzz);
app.get('/buzz/:buzzId/unlike', fireBaseAuth, unlikeBuzz);
app.delete('/buzz/:buzzId', fireBaseAuth, deleteBuzz);

// User routes
app.post('/signup', signUpUser);
app.post('/login', loginUser);
app.post('/users/image', fireBaseAuth, uploadImage);
app.post('/user', fireBaseAuth, addUserDetails);
app.get('/user', fireBaseAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
