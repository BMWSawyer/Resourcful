/*
 * All routes for Register are defined here
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { addUser, getUserWithId } = require('../database');

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });

  router.post("/", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    addUser(user, db)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }
      res.redirect("/");
    })
    .catch(error => res.send(error));
  });

  return router;
};
