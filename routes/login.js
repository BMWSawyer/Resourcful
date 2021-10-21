/*
 * All routes for Login are defined here
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    req.session.user_id = req.params.id;
    res.render("/login");
  });

  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */

   const login =  function(email, password) {
    return database.getUserWithEmail(email) // MAKE SURE TO CORRECT LINK TO database
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }
  exports.login = login;

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.send({user: {name: user.name, email: user.email, id: user.id}});
      })
      .catch(error => res.send(error));
  });

  return router;
};
