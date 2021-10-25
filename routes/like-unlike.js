/*
 * All routes for liking and unliking a resource are defined here
 */

const express = require('express');
const router  = express.Router();
const { likingAResource } = require('../database');

module.exports = (db) => {

  router.post('/:resourceId', (req, res) => {
    const userId = req.session.user_id;
    const { resourceId } = req.params.resourceId;
    likingAResource(userId, resourceId, db)
      .then(data => {
        if (!data) {
          res.send({error: "error"});
          return;
        }

        res.send({data: data})
      })
      .catch(error => res.send(error));
  });

  return router;
};
