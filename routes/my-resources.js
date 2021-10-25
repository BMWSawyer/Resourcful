/*
 * All routes for a users resources are defined here
 */

const express = require('express');
const router  = express.Router();
const { getUserWithEmail } = require('../database');

module.exports = (db) => {

  router.get('/', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.user_id = user.id;
        res.render("/my-resources", resources)
      })
      .catch(error => res.send(error));
  });

  return router;
};
