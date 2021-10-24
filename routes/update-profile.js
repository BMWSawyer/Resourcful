/*
 * All routes for updating a users profile are defined here
 */

const express = require('express');
const router  = express.Router();
const { updateUser } = require('../database');

module.exports = (db) => {

  router.post('/', (req, res) => {
    const userId = req.session.user_id
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const userData = {
      firstName,
      lastName,
      email
    };

    updateUser(userData, userId, db)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        res.send({ user })
      })
      .catch(error => res.send(error));
  });

  return router;
};
