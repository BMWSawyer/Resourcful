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
      error:"Please enter a valid email address",
    });
  });

  router.get("/profile", (req, res) => {
    res.render('profile', {
      error:"test issue",
      user:{id:"1", firstName:"Test", lastName:"McTester", email:"mctester@fakeemail.com"}
    });
  });

  router.get("/resources/:id", (req, res) => {
    res.render('resources', {
      error:"test issue",

      resource:{title:"Sample Title",
      id: "2",
      imgURL: "/mockups/mockupResources/sharon-mccutcheon-tn57JI3CewI-unsplash.jpg",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      URL: "http://www.amazon.ca",
      topic: "Fast food",
      ownerID: "1"},

      user:{id:"2", firstName:"Test", lastName:"McTester", email:"mctester@fakeemail.com"},

      resource_ratings:{
        id: "1",
        user_id: "1",
        resource_id: "2",
        rating: "2",
        liked: true
      },

      ratingsTotal:3.2
    });
  });

  return router;
};
