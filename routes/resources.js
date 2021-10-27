/*
 * All routes for Resourcs are defined here
 */

const express = require('express');
const router = express.Router();
const {
  addResource,
  getIndividualResource,
  searchResources,
  likingAResource,
  rateAResource,
  addComment,
  getCommentsByResource,
  camelCase,
  getAverageRatingByResource,
  getRatingByUser,
  getUserWithId,
  getResourcesForUser
} = require('../database');

module.exports = (db) => {

  // Add resource route
  router.post('/new', (req, res) => {
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
          res.send({ error: "error" });
          return;
        }
        // req.session.user_id = user.id;
        res.send({ resource });
      })
      .catch(error => res.send(error));
  });

  // My resources route
  router.get('/my-resources', (req, res) => {
    const userId = req.session.user_id;
    let user;

    getUserWithId(userId, db)
      .then((u) => {
        user = u;
        return getResourcesForUser(userId, db);
      })
      .then((usersResources) => {

        if (!usersResources) {
          res.send({ error: "error" });
          return;
        }

        const topics = [];

        console.log(usersResources);

        for (const resource of usersResources) {

          let foundTopic = false;
          for (const topic of topics) {
            if (topic.name === resource.category) {
              topic.resources.push(resource);
              foundTopic = true;
            }
          }

          if (!foundTopic) {
            topics.push({
              'name': resource.category,
              'resources': [resource]
            });
          }

        }
        console.log("---")
        console.log(topics);

        res.render("my-resources", {
          user: {
            'userId': userId,
            'firstName': user.firstname,
            'lastName': user.lastname,
          },
          topics: topics
        });
      })
      .catch(error => res.send(error));
  });


  // View individual resource route
  router.get('/:resourceId', (req, res) => {
    const userId = req.session.user_id;
    const resourceId = req.params.resourceId;

    Promise.all([
      getUserWithId(userId, db),
      getIndividualResource(resourceId, db),
      getCommentsByResource(resourceId, db),
      getAverageRatingByResource(resourceId, db),
      getRatingByUser(userId, resourceId, db)
    ])
      .then(([user, resource, comments, averageRating, resourceRating]) => {
        resource.comments = comments;
        resource.averageRating = averageRating;
        resource.resourceRating = resourceRating;
        console.log({ user, resource });
        res.render("resources", { user, resource });
      })
      .catch(error => res.send(error));

  });

  // Search resources route
  router.get('/search', (req, res) => {

    getAllResources(db)
      .then(resources => {
        if (!resources) {
          res.send({ error: "error" });
          return;
        }

        res.render("search", { resources: resources });
      })
      .catch(error => {
        res.send(error);
      });
  });

  router.get('/search/:query', (req, res) => {
    const userId = req.session.user_id;
    const user = getUserWithId(userId, db);
    const topic = req.params.query;
   // const averageRating = getAverageRatingByResource(resourceId, db); // THIS NEEDS TO BE FIXED - NO RESOURCE ID
   // const resourceRating = getRatingByUser(userId, resourceId, db); // THIS NEEDS TO BE FIXED - NO RESOURCE ID


    searchResources(topic, db)
      .then(resources => {
        if (!resources) {
          res.send({ error: "error" });
          return;
        }

        resources['resourceRating'] = resourceRating;
        resources['averageRating'] = averageRating;

        res.render("search", { user: {
          'userId': userId,
          'firstName': user.firstname,
          'lastName': user.lastname,
        }, resources: resources});
      })
      .catch(error => res.send(error));
  });

  // Like a resource route
  router.post('/like/:resourceId', (req, res) => {
    const userId = req.session.user_id;
    const resourceId = req.params.resourceId;

    likingAResource(userId, resourceId, db)
      .then(data => {
        if (!data) {
          res.send({ error: "error" });
          return;
        }

        res.send(data)
      })
      .catch(error => res.send(error));
  });

  // Rating a resource route
  router.post('/rating/:resourceId', (req, res) => {
    const userId = req.session.user_id;
    const resourceId = req.params.resourceId;
    const rating = req.body.rating

    rateAResource(userId, resourceId, rating, db)
      .then(data => {
        if (!data) {
          res.send({ error: "error" });
          return;
        }

        res.send(data)
      })
      .catch(error => res.send(error));
  });

  // Comment on a resource route
  router.post('/comment/resourceId', (req, res) => {
    const resourceId = req.params.resourceId;
    const userId = req.session.user_id;
    const text = req.body.comment;
    const date = Date.now();

    const comment = {
      resourceId,
      userId,
      text,
      date
    };

    addComment(comment, db)
      .then(comment => {
        if (!comment) {
          res.send({ error: "error" });
          return;
        }

        res.send(comment);
      })
      .catch(error => res.send(error));
  });

  // Update a resource route -- This is a stretch if we get to it
  /*
  router.post('/update', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.user_id = user.id;
        res.render("/my-resources", resources)
      })
      .catch(error => res.send(error));
  });
  */

  return router;
};
