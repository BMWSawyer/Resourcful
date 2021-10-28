/*
 * All routes for Users are defined here
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {
  addUser,
  getUserWithId,
  getUserWithEmail,
  updateUser,
} = require('../database');


module.exports = (db) => {

  // Login route

  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
  **/
  const login = function (email, password) {
    return getUserWithEmail(email, db)
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  }

  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    login(email, password)
      .then(user => {
        if (!user) {
          res.send({ error: "error" });
          return;
        }

        req.session.user_id = user.id;
        res.redirect("/resources/my-resources")
      })
      .catch(error => res.send(error));
  });


  // Logout route
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });


  // Register route
  router.get("/register", (req, res) => {
    res.render("register");
  });

  router.post("/register", (req, res) => {
    const user = req.body;

    user.password = bcrypt.hashSync(user.password, 12);
    addUser(user, db)
      .then(user => {
        if (!user) {
          res.send({ error: "error" });
          return;
        }
        res.redirect("/");
      })
      .catch(error => res.send(error));
  });


  // Update profile route
  router.get("/profile", (req, res) => {
    const userId = req.session.user_id;

    getUserWithId(userId, db)
      .then(user => {
        if (!user) {
          res.send({ error: "error" });
          return;
        }

        res.render("profile", {user});
      })
      .catch(error => res.send(error));
  });

  router.post('/profile/update', (req, res) => {
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
          res.send({ error: "error" });
          return;
        }
        res.render("profile", {user});
      })
      .catch(error => res.send(error));
  });


  return router;
};
