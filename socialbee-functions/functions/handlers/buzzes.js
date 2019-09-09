const { db } = require('../util/admin');

exports.getAllBuzzes = (req, res) => {
  db.collection('buzzes')
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
};

exports.postOneBuzz = (req, res) => {
  if (req.body.body.trim() === '') {
      return res.status(400).json({ body: 'Body must not be empty '});
    }

  const newBuzz = {
      body: req.body.body,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0
  };

  // make the id of the db doc be the response buzzId and return that response as json
  db.collection('buzzes')
      .add(newBuzz)
      .then((doc) => {
          const responseBuzz = newBuzz;
          responseBuzz.buzzId = doc.id;
          res.json({ responseBuzz });
      })
      .catch((err) => {
          res.status(500).json({ error: `something went wrong` });
          console.error(err);
      })
};

exports.getBuzzById = (req, res) => {
  let buzzData = {};
  db.doc(`/buzzes/${req.params.buzzId}`).get()
      .then((doc) => {
          if(!doc.exists) {
              return res.status(404).json({ message: 'Buzz does not exist' });
          }
          buzzData = doc.data();
          buzzData.buzzId = doc.id;
          return db
              .collection('comments')
              .where('buzzId', '==', req.params.buzzId)
              .orderBy('createdAt', 'desc')
              .get();
      })
      .then((data) => {
          buzzData.comments = [];
          data.forEach((doc) => {
              buzzData.comments.push(doc.data());
          });
          return res.json(buzzData);
      })
      .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
      });
};

exports.addBuzzComment = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        buzzId: req.params.buzzId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/buzzes/${req.params.buzzId}`).get()
        .then((doc) => {
          if (!doc.exists) {
              return res.status(404).json({ error: 'Buzz not found' });
          }
          return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            return res.json(newComment);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.likeBuzz = (req, res) => {
    const likeDocument = db.collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('buzzId', '==', req.params.buzzId)
        .limit(1);

    const buzzDocument = db.doc(`/buzzes/${req.params.buzzId}`);
    let buzzData;

    buzzDocument.get()
        .then((doc) => {
            if (doc.exists) {
                buzzData = doc.data();
                buzzData.buzzId = doc.id;
                        console.log('buzzData:' , buzzData);
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Buzz not found' });
            }
        })
        .then((data) => {
            // check if the person has already liked this buzz
            if (data.empty) {
                return db.collection('likes').add({
                    buzzId: req.params.buzzId,
                    userHandle: req.user.handle
                })
                    .then(() => {
                        buzzData.likeCount++;
                        return buzzDocument.update({ likeCount: buzzData.likeCount });
                    })
                    .then(() => {
                        return res.json(buzzData);
                    })
            } else {
                res.status(400).json({ error: "You've already liked this Buzz "});
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
};

exports.unlikeBuzz = (req, res) => {
    const likeDocument = db.collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('buzzId', '==', req.params.buzzId)
        .limit(1);

    const buzzDocument = db.doc(`/buzzes/${req.params.buzzId}`);
    let buzzData;

    buzzDocument.get()
        .then((doc) => {
            if (doc.exists) {
                buzzData = doc.data();
                buzzData.buzzId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Buzz not found' });
            }
        })
        .then((data) => {
            // check if the person has not liked this buzz already
            if (data.empty) {
                res.status(400).json({error: "You've not liked this Buzz before "});
            } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        buzzData.likeCount--;
                        return buzzDocument.update({ likeCount: buzzData.likeCount });
                    })
                    .then(() => {
                        return res.json(buzzData);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
};

exports.deleteBuzz = (req, res) => {
  const document = db.doc(`/buzzes/${req.params.buzzId}`);
  document.get()
      .then((doc) => {
          if (!doc.exists) {
              return res.status(404).json({ error: 'Buzz not found' });
          }
          if (doc.data().userHandle !== req.user.handle) {
              return res.status(403).json({ error: 'Unauthorized' });
          } else {
              return document.delete();
          }
      })
      .then(() => {
          return res.json({ message: 'Buzz deleted successfully' });
      })
      .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
      }
    )
};
