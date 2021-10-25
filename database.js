//
// NEED TO ADD A FUNCTION TO GET ALL RESOURCES A USER HAS LIKED!!
// NEED TO ADD A FUNCTION TO GET ALL RESOURCES A USER HAS CREATED!!
//

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithEmail = function (email, db) {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (!result.rows.length) {
        return null;
      }

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id, db) {
  return db
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (!result.rows.length) {
        return null;
      }

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
 const addUser = function (user, db) {
  return db
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)  RETURNING *`,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get all resources.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the resources.
 */
 const getAllResources = function (category, limit = 10, db) {
  const queryParams = [];

  let queryString = `
    SELECT * FROM resources
    `;

  if (category) {
    queryParams.push(`%${category}%`);
    queryString += `WHERE category = $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
    LIMIT $${queryParams.length};
  `;

  return db.query(queryString, queryParams)
  .then((res) => res.rows);
};

/**
 * Add a resource to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the resource.
 */
 const addResource = function (resource, db) {

  return db
    .query(
      `INSERT INTO resources (creator_id, title, description, resource_url, image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        resource.userId,
        resource.title,
        resource.description,
        resource.resource_url,
        resource.image
      ]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//
//  Updates an existing user with new information
//
const updateUser = function(userData, userId, db) {

  let queryString = `UPDATE users SET `;

  const queryParams = [];
  console.log(userData);

  if (userData.firstName) {
    queryParams.push(userData.first_name);
    queryString += `start_date = $${queryParams.length}`;
  }

  if (userData.lastName) {
      queryParams.push(userData.last_name);
      queryString += `, last_name = $2`;
  }

  if (userData.email) {
    queryParams.push(userData.end_date);
    queryString += `end_date = $1`;
  }

  queryParams.push(userId);
  queryString += ` WHERE id = $${queryParams.length} RETURNING *;`



  return db.query(queryString, queryParams)
  .then((res) => res.rows[0])
  .catch((error) => console.error(error));
}

//
//  Deletes an existing resource
//
const deleteResource = function(resourceId, db) {
  const queryParams = [resourceId];
  const queryString = `DELETE FROM resources WHERE id = $1`;

  return db.query(queryString, queryParams)
  .then(() => console.log("Successfully deleted!"))
  .catch((error) => console.error(error));
}

//
//  Gets an individual resource
//
const getIndividualResource = function(resourceId, db) {
  const queryString = `SELECT * FROM resources WHERE id = $1`;
  return db.query(queryString, [resourceId])
  .then(res => res.rows[0]);
}

/*
 *  Gets ratings by resource
 */
const getRatingsByResource = function(resourceId, db) {
  const queryString = `
    SELECT id, resource_id, AVG(rating), COUNT(like)
    FROM resource_ratings
    WHERE resource_id = $1;
  `;

  const queryParams = [resourceId];
  return db.query(queryString, queryParams).then(res => res.rows)
}

//
//  Adds a comment
//
const addComment = function (comment, db) {

  const queryString = `
    INSERT INTO comments (user_id, resource_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const queryParams = [comment.userId, comment.resourceId, comment.text];

  return db.query(queryString, queryParams).then(res => res.rows);
}

//
//  Gets all comments for a resource
//
const getCommentsByResource = function (resourceId, db) {
  const queryString = `
  SELECT comments.id, comments.comment, comments.date, users.first_name, users.last_name
  FROM comments
  JOIN users ON users.id = user_id
  WHERE resource_id = $1
  ORDER BY comments.date;
`;

const queryParams = [resourceId];
return db.query(queryString, queryParams).then(res => res.rows)
}


//
//  Likes or Unlikes a resource
//
const likingAResource = function (userId, resourceId, db) {
  let queryString = `UPDATE resource_ratings SET `;

  const subQuery = db.query(`
  SELECT like
  FROM resource_ratings
  WHERE user_id = $${userId}
  AND resource_id = $${resourceId}`);

  if (subQuery) {
    queryString += `like = FALSE`;

  } else {
    queryString += `like = TRUE`;
  }

  queryString += ` WHERE user_id = $${userId} AND resource_id = $${resourceId} RETURNING *;`

  console.log(queryString);

  return db.query(queryString)
  .then((res) => res.rows[0])
  .catch((error) => console.error(error));
}

//
//  Rates a resource
//
const rateAResource = function (userId, resourceId, rating, db) {

  const queryString = `
    INSERT INTO resource_ratings (user_id, resource_id, rating)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const queryParams = [userId, resourceId, rating];

  return db.query(queryString, queryParams).then(res => res.rows);
}

//
//  Searches all resources based on the topic
//
const searchResources = function (topic, db) {

  const queryString = `
    SELECT *
    FROM resources
    WHERE topic LIKE (%$1%);
  `;

  const queryParams = [topic];

  return db.query(queryString, queryParams).then(res => res.rows);
}

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllResources,
  addResource,
  updateUser,
  deleteResource,
  getIndividualResource,
  getRatingsByResource,
  addComment,
  getCommentsByResource,
  likingAResource,
  rateAResource,
  searchResources
};
