/*
 * All routes for Login are defined here
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { getUserWithEmail } = require('../database');

module.exports = (db) => {
  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
  **/
   const login =  function(email, password) {
    return getUserWithEmail(email, db)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }

  router.post('/', (req, res) => {
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
