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