const functions = require ('firebase-functions');
// using express to figure out the apis
const app = require ('express')();
// use auth middleware so that we restrict who posts a buzz
const fireBaseAuth = require('./util/FBAuth');
const { db } = require ('./util/admin');

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
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead } = require('./handlers/users');

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
app.get('/user/:handle', getUserDetails);
app.post('/notifications', fireBaseAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

// database trigger, not api endpoint so no response needed to send back
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
  db.doc(`/buzzes/${snapshot.data().buzzId}`).get()
  .then((doc) => {
    if (doc.exists) {
      return db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: doc.data().userHandle,
        sender: snapshot.data().userHandle,
        read: false,
        type: 'like',
        buzzId: doc.id
      })
    }
  })
  .then(() => {
    return;
  })
  .catch((err) => {
    console.error(err);
    return;
  });
});

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
  db.doc(`notifications/${snapshot.id}`).delete()
  .then(() => {
    return;
  })
  .catch((err) => {
    console.error(err);
    return;
  });
});

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
  db.doc(`/buzzes/${snapshot.data().buzzId}`).get()
  .then((doc) => {
    if (doc.exists) {
      return db.doc(`/notifications/${snapshot.id}`).set({
        recipient: doc.data().userHandle,
        sender: snapshot.data().userHandle,
        read: false,
        buzzId: doc.id,
        type: 'comment',
        createdAt: new Date().toISOString()
      })
    }
  })
  .then(() => {
    return;
  })
  .catch((err) => {
    console.error(err);
    return;
  });
});
