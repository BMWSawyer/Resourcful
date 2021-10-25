/*
 * All routes for searching are defined here
 */

const express = require('express');
const router  = express.Router();
const { searchResources } = require('../database');

module.exports = (db) => {

  router.get('/:query', (req, res) => {
    const topic = req.params.query;
    searchResources(topic, db)
      .then(resources => {
        if (!resources) {
          res.send({error: "error"});
          return;
        }

        res.send(resources);
      })
      .catch(error => res.send(error));
  });

  return router;
};
