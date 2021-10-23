/*
 * All routes for comments are defined here
 */

const express = require('express');
const router  = express.Router();
const { getUserWithEmail } = require('../database');

module.exports = (db) => {

  router.post('/', (req, res) => {
    const resource_id = req.body.resource_id;
    const user_id = req.session.user_id;
    const comment = req.body.comment;
    const date = Date.now();

    const comment = {
      resource_id,
      user_id,
      comment,
      date
    };

    addComment(comment, db)
      .then(comment => {
        if (!comment) {
          res.send({error: "error"});
          return;
        }
        // req.session.user_id = user.id;
        res.render("/resource/:resourceId", comment);
      })
      .catch(error => res.send(error));
  });

  return router;
};
