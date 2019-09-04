const { db } = require('../util/admin');

exports.getAllBuzzes = (req, res) => {
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
};

exports.postOneBuzz = (req, res) => {
  const newBuzz = {
      body: req.body.body,
      userHandle: req.user.handle,
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
