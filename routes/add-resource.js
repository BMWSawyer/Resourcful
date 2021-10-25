/*
 * All routes for adding a resource are defined here
 */

const express = require('express');
const router  = express.Router();
const { addResource } = require('../database');

module.exports = (db) => {

  router.post('/', (req, res) => {
    const userId = req.session.user_id
    const title = req.body.title;
    const description = req.body.description;
    const resource_url = req.body.resource_url;
    const image = req.body.image;

    const resource = {
      userId,
      title,
      description,
      resource_url,
      image
    };

    addResource(resource, db)
      .then(resource => {
        if (!resource) {
          res.send({error: "error"});
          return;
        }
        // req.session.user_id = user.id;
        res.sned({ resource });
      })
      .catch(error => res.send(error));
  });

  return router;
};