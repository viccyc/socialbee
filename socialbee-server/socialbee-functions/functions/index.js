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
app.post('/user/image', fireBaseAuth, uploadImage);
app.post('/user', fireBaseAuth, addUserDetails);
app.get('/user', fireBaseAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', fireBaseAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

// database trigger, not api endpoint so no response needed to send back
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
      return db.doc(`/buzzes/${snapshot.data().buzzId}`).get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
      .catch((err) =>
          console.error(err));
    });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
      return db.doc(`notifications/${snapshot.id}`)
      .delete()
      .catch((err) =>
        console.error(err));
    });

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
      return db.doc(`/buzzes/${snapshot.data().buzzId}`).get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
      .catch((err) =>
        console.error(err));
    });

// update previous buzzes with new user image when the user changes their profile image
exports.onUserImageChange = functions.firestore.document('users/{userId}')
    .onUpdate((change) => {
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch();
            const commentBatch = db.batch();
            return db.collection('buzzes')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const buzz = db.doc(`/buzzes/${doc.id}`);
                        batch.update(buzz, { userImage: change.after.data().imageUrl });
                    });
                    return batch.commit();
                })
                .then((data) => {
                    return db.collection('comments')
                        .where('userHandle', '==', change.before.data().handle)
                        .get()
                        .then((data) => {
                            data.forEach((doc) => {
                                const comment = db.doc(`/comments/${doc.id}`);
                                commentBatch.update(comment, { userImage: change.after.data().imageUrl });
                            });
                            return commentBatch.commit();
                        })
                })
                .catch((err) =>
                    console.error(err));
        } else return true;
    });

// when buzz is deleted, delete all related data
exports.onBuzzDelete = functions.firestore.document('buzzes/{buzzId}')
    .onDelete((snapshot, context) => {
        const buzzId = context.params.buzzId;
        const batch = db.batch();
        return db.collection('comments')
            .where('buzzId', '==', buzzId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db.collection('likes')
                    .where('buzzId', '==', buzzId)
                    .get()
                    .then((data) => {
                        data.forEach((doc) => {
                            batch.delete(db.doc(`/likes/${doc.id}`));
                        });
                        return db.collection('notifications')
                            .where('buzzId', '==', buzzId)
                            .get()
                            .then((data) => {
                                data.forEach((doc) => {
                                    batch.delete(db.doc(`/notifications/${doc.id}`));
                                });
                                return batch.commit();
                            })
                    })
            })
            .catch((err) => console.error(err));
    });
