const { admin, db } = require('../util/admin');
const { validateSignUpData, validateLoginData, reduceUserDetails } = require('../util/validators');

const firebase = require('firebase');
const config = require('../util/config');
firebase.initializeApp(config);

exports.signUpUser = (req, res) => {
  const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle,
  };

  const { errors, valid } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImg = 'no-img.png';

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
              imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
};

exports.loginUser = (req, res) => {
  const user = {
      email: req.body.email,
      password: req.body.password
  };

  const { errors, valid } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
          return data.user.getIdToken();
      })
      .then((token) => {
          return res.json({ token })
      })
      .catch((err) => {
          console.error(err);
          if (err.code === 'auth/wrong-password') {
              return res.status(403).json({ general: 'Login credentials are incorrect. Please try again'});
          } else return res.status(500).json({ error: err.code });
      });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`).get()
      .then((doc) => {
          if(doc.exists) {
              userData.credentials = doc.data();
              return db.collection('likes')
                  .where('userHandle', '==', req.user.handle).get()
          }
      })
      .then((data) => {
          userData.likes = [];
          data.forEach((doc) => {
              userData.likes.push(doc.data());
          });
          return db.collection('notifications')
              .where('recipient', '==', req.user.handle)
              .orderBy('createdAt', 'desc')
              .limit(10)
              .get();
      })
      .then((data) => {
          userData.notifications = [];
          data.forEach((doc) => {
              userData.notifications.push({
                  recipient: doc.data().recipient,
                  sender: doc.data().sender,
                  createdAt: doc.data().createdAt,
                  buzzId: doc.data().buzzId,
                  type: doc.data().type,
                  read: doc.data().read,
                  notificationId: doc.id
              });
          });
          return res.json(userData);
      })
      .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
      })
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            res.json({ message: 'User updated successfully' });
        })
        .catch((err) => {
            res.status(500).json({ error: err.code });
        })
};

// upload a profile image for user
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
       if (!mimetype.startsWith('image')) {
           return res.status(400).json({ error: 'Wrong file type submitted'});
       }

       const imageExtension = filename.split('.')[filename.split('.').length - 1];
       imageFileName = `${Math.round(Math.random()*100000000)}.${imageExtension}`;
       const filePath = path.join(os.tmpdir(), imageFileName);
       imageToBeUploaded = { filePath, mimetype };
       file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('finish', () => {
      admin.storage().bucket().upload(imageToBeUploaded.filePath, {
          resumable: false,
          metadata: {
              metadata: {
                  contentType: imageToBeUploaded.mimetype
              }
          }
      })
          .then(() => {
          // alt=media saves to db rather than downloading image file
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
          .then(() => {
              return res.json({ message: 'Image uploaded successfully '});
          })
          .catch((err) => {
              console.error(err);
              return res.status(500).json({ error: err.code });
          })
    });

    busboy.end(req.rawBody);
};

// gets details of any user when handle is given
exports.getUserDetails = (req, res) => {
    let userData = [];
    db.doc(`/users/${req.params.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection('buzzes')
                    .where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get()
            } else {
                return res.status(404).json({ error: 'User handle does not exist' });
            }
        })
        .then((data) => {
            userData.buzzes = [];
            data.forEach((doc) => {
                userData.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    buzzId: doc.id
                })
            });
            return res.json(userData);
        })
        .catch((err) =>{
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
};

// takes a array body of notifications to update to read
exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked read' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};
