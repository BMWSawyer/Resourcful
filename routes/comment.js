/*
 * All routes for comments are defined here
 */

const express = require('express');
const router  = express.Router();
const { addComment } = require('../database');

module.exports = (db) => {

  router.post('/', (req, res) => {
    const resourceId = req.body.resource_id;
    const userId = req.session.user_id;
    const comment = req.body.comment;
    const date = Date.now();

    const comment = {
      resourceId,
      userId,
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
        res.send({ comment });
      })
      .catch(error => res.send(error));
  });

  return router;
};
