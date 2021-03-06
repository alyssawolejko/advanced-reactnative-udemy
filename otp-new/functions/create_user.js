const admin = require('firebase-admin');

module.exports = function(req, res) {

  // verify the user provided a phone 
  if (!req.body.phone) {
    return res.status(422).send({ error: 'Bad Input' });
  }

  // format the phone number 
  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  // create new user account
  admin.auth().createUser({ uid: phone })
    .then(user => res.send(user))
    .catch(err => res.status(422).send({ error: err }));

}