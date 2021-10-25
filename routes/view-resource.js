/*
 * All routes for viewing a specific resource are defined here
 */

const express = require('express');
const router  = express.Router();
const { getIndividualResource } = require('../database');

module.exports = (db) => {

  router.post('/:resourceId', (req, res) => {
    const { resourceId } = req.params.resourceId;
    getIndividualResource(resourceId, db)
      .then(resource => {
        if (!resource) {
          res.send({error: "error"});
          return;
        }

        res.send({resource: resource})
      })
      .catch(error => res.send(error));
  });

  return router;
};
