/*
 * All routes for Logout are defined here
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
