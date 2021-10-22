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
 const getAllResources = function (options, limit = 10, db) {
  const queryParams = [];

  let queryString = `
    SELECT resources.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);

    if (queryParams.length !== 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }

    queryString += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(
      options.minimum_price_per_night,
      options.maximum_price_per_night
    );

    if (queryParams.length !== 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }

    queryString += `cost_per_night BETWEEN ($${queryParams.length - 1} * 100) AND ($${queryParams.length} * 100) `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);

    if (queryParams.length !== 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }

    queryString += `cost_per_night >= ($${queryParams.length} * 100) `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);

    if (queryParams.length !== 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }

    queryString += `cost_per_night <= ($${queryParams.length} * 100) `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);

    if (queryParams.length !== 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }

    queryString += `property_reviews.rating >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  // console.log(queryString, queryParams);
  return db.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a resource to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the resource.
 */
 const addResource = function (resource, db) {

  return db
    .query(
      `INSERT INTO resources (user_id, title, description, resource_url, image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        resource.owner_id,
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
const updateUser = function(userData, db) {
  let queryString = `UPDATE users SET `;

  const queryParams = [];
  console.log(userData);

  if (userData.first_name) {
    queryParams.push(newReservationData.start_date);
    queryString += `start_date = $${queryParams.length}`;
  }

  if (userData.last_name) {
      queryParams.push(userData.last_name);
      queryString += `, last_name = $2`;
  }

  if (userData.email) {
    queryParams.push(userData.end_date);
    queryString += `end_date = $1`;
  }

  queryParams.push(userData.reservation_id);
  queryString += ` WHERE id = $${queryParams.length} RETURNING *;`


  console.log(queryString);

  // console.log(queryString, queryParams);

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
  const queryString = `SELECT * FROM resources WHERE resources.id = $1`;
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

  const queryParams = [comment.user_id, comment.resource_id, comment.comment];

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
  getCommentsByResource
}
