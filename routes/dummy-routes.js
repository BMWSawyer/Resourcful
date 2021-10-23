/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get("/register", (req, res) => {
    res.render('register', {
      // error:"Please enter a valid email address",
    });
  });

  router.get("/profile", (req, res) => {
    res.render('profile', {
      error: "test issue",
      user: { id: "1", firstName: "Test", lastName: "McTester", email: "mctester@fakeemail.com" }
    });
  });

  router.get("/resources/:id", (req, res) => {
    res.render('resources', {
      user: {
        id: 1,
        firstName: "Test",
        lastName: "McTester",
        email: "mctester@fakeemail.com"
      },
      resource: {
        id: 1,
        creatorId: 1,
        title: "More Stuff",
        description: "read all this",
        resourceUrl: "http://www.amazon.ca",
        photoUrl: "/mockups/mockupResources/sharon-mccutcheon-tn57JI3CewI-unsplash.jpg",
        resourceRating: {
          liked: true,
          rating: 4,
        },
        averageRating: 3.4,
        comments: [{
          id: 1,
          firstName: "Isabelle",
          lastName: "Ringing",
          comment: "This was a great resource!",
          date: "2019-09-07T15:50+00Z"
        },
        ],
      },
    });
  });

  router.get("/my-resources/", (req, res) => {
    res.render('my-resources', {
      user: {
        id: 1,
        firstName: "Test",
        lastName: "McTester",
        email: "mctester@fakeemail.com",
      },
      topics: [{
        name: "Literature",
        resources: [{
          id: 4,
          creatorId: 1,
          title: "Historic Reads",
          description: "Reading about history",
          resourceUrl: "http://www.example.com",
          photoUrl: "/mockups/mockupResources/sharon-mccutcheon-tn57JI3CewI-unsplash.jpg",
          resourceRating: {
            liked: false,
            rating: 5,
          },
          averageRating: 4.3,
        }, {
          id: 1,
          creatorId: 2,
          title: "Great Reads",
          description: "Books and stuff...",
          resourceUrl: "http://www...",
          photoUrl: "/mockups/mockupResources/sharon-mccutcheon-tn57JI3CewI-unsplash.jpg",
          resourceRating: {
            liked: true,
            rating: 5,
          },
          averageRating: 3.3,
        }],
      }, {
        name: "Science Hacks",
        resources: [{
          id: 2,
          creatorId: 1,
          title: "Science Stuff",
          description: "read all this",
          resourceUrl: "http://...",
          photoUrl: "/mockups/mockupResources/sharon-mccutcheon-tn57JI3CewI-unsplash.jpg",
          resourceRating: {
            liked: true,
            rating: null,
          },
          averageRating: 2.6,
        }, {
          id: 1,
          creatorId: 2,
          title: "More Stuff",
          description: "read all this",
          resourceUrl: "http://...",
          photoUrl: "/mockups/mockupResources/sharon-mccutcheon-tn57JI3CewI-unsplash.jpg",
          resourceRating: {
            liked: false,
            rating: 4,
          },
          averageRating: null,
        }],
      }],
    });
  });

  return router;
};
