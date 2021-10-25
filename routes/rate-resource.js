/*
 * All routes for rating a resource are defined here
 */

const express = require('express');
const router  = express.Router();
const { rateAResource } = require('../database');

module.exports = (db) => {

  router.post('/', (req, res) => {
    const userId = req.session.user_id;
    const resourceId = req.params.resourceId;
    const rating = req.body.rating

    rateAResource(userId, resourceId, rating, db)
      .then(data => {
        if (!data) {
          res.send({error: "error"});
          return;
        }

        res.send(data)
      })
      .catch(error => res.send(error));
  });

  return router;
};
