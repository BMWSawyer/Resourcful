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
const getUserWithId = function (userId, db) {
  return db
    .query(`SELECT id, users.first_name as firstName, users.last_name as lastName, users.email
    FROM users WHERE id = $1`, [userId])
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
      `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)  RETURNING *`,
      [user.firstName, user.lastName, user.email, user.password]
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
const getAllResources = function (userId, db) {

  let queryString = `
    SELECT r.*, rr.liked AS like, rr.rating AS rating, ar.avg_rating
    FROM
      resources r
    LEFT JOIN
      (SELECT * FROM resource_ratings rr2 WHERE rr2.user_id = $1) rr
    ON rr.resource_id = r.id
    JOIN
      (SELECT resource_id, avg(rating) AS avg_rating FROM resource_ratings GROUP BY resource_id) ar
    ON ar.resource_id = r.id
    `;

  return db.query(queryString, [userId])
    .then(res => res.rows);
}

const getAllGuestResources = function (db) {

  let queryString = `
    SELECT DISTINCT resources.*,  AVG(resource_ratings.rating) as avg_rating
    FROM resources
    JOIN resource_ratings ON resources.id = resource_ratings.resource_id
    GROUP BY resources.id
    `;

  return db.query(queryString)
    .then(res => res.rows);
}

/**
 * Add a resource to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the resource.
 */
const addResource = function (resource, db) {
//needs to add adding a category here

let categoryInsert = `INSERT INTO categories (category)
      VALUES (${resource.category})
      RETURNING *`;

// let resourceCategoryInsert = `INSERT INTO resource_categories (resource_id, category_id)
// VALUES (${resource.category})
// RETURNING *`;

console.log('************');
console.log(resource);
  return db
    .query(
      `INSERT INTO resources (creator_id, title, description, resource_url, photo_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        resource.userId,
        resource.title,
        resource.description,
        resource.resource_url,
        resource.photo_url,
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
const updateUser = function (userData, userId, db) {

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
    queryString += `email = $1`;
  }

  queryParams.push(userId);
  queryString += ` WHERE id = $${queryParams.length} RETURNING *;`



  return db.query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

//
//  Updates an existing resource with new information
//
const updateResource = function (resourceData, resourceId, db) {

  let queryString = `UPDATE resources SET `;

  const queryParams = [];
  console.log(resourceData);

  if (resourceData.title) {
    queryParams.push(resourceData.title);
    queryString += `title = $${queryParams.length}`;
  }

  if (resourceData.description) {
    queryParams.push(resourceData.description);
    queryString += `, description = $${queryParams.length}`;
  }

  if (resourceData.url) {
    queryParams.push(resourceData.url);
    queryString += `, resource_url = $${queryParams.length}`;
  }

  //Update rating
  // if (resourceData.rating) {
  //   queryParams.push(resourceData.rating);
  //   queryString += `photo_url = $${queryParams.length}`;
  // }

  //We need to update the category
  // if (resourceData.category) {
  //   queryParams.push(resourceData.category);
  //   queryString += `category = $${queryParams.length}`;
  // }

  queryParams.push(resourceId);
  queryString += ` WHERE id = $${queryParams.length} RETURNING *;`

  return db.query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
};

//
//  Deletes an existing resource -- THIS IS A STRETCH GOAL
//
// const deleteResource = function(resourceId, db) {
//   const queryParams = [resourceId];
//   const queryString = `DELETE FROM resources WHERE id = $1`;

//   return db.query(queryString, queryParams)
//   .then(() => console.log("Successfully deleted!"))
//   .catch((error) => console.error(error));
// }

//
//  Gets an individual resource
//
const getIndividualResource = function (resourceId, db) {
  const queryString = `SELECT * FROM resources WHERE id = $1`;

  return db.query(queryString, [resourceId])
    .then(res => res.rows[0]);
}

//  Gets a resource category by name
//
const getResourceCategoryByName = function (categoryName, db) {
  const queryString = `SELECT * FROM categories
  WHERE categories.category = $1`;

  return db.query(queryString, [categoryName])
    .then(res => res.rows[0]);
}


//  Gets a resource category by resource ID
//
const getResourceCategory = function (resourceId, db) {
  const queryString = `SELECT category FROM categories
  JOIN resource_categories ON categories.id = resource_categories.category_id
  WHERE resource_categories.resource_id = $1`;

  return db.query(queryString, [resourceId])
    .then(res => res.rows[0]);
}

/*
 *  Gets average rating by resource
 */
const getAverageRatingByResource = function (resourceId, db) {
  const queryString = `SELECT AVG(rating) FROM resource_ratings WHERE resource_id = $1`;

  const queryParams = [resourceId];
  return db.query(queryString, queryParams).then(res => res.rows[0]);
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
  return db.query(queryString, queryParams).then(res => res.rows[0]);
}

//
//  Gets all comments for a resource
//
const getCommentsByResource = function (resourceId, db) {
  const queryString = `
  SELECT comments.id, comments.comment, comments.comment_date as date, users.first_name, users.last_name
  FROM comments
  JOIN users ON users.id = user_id
  WHERE resource_id = $1
  ORDER BY comments.comment_date DESC;
`;

  const queryParams = [resourceId];
  return db.query(queryString, queryParams).then(res => res.rows)
}


//
//  Likes or Unlikes a resource
//
const likingAResource = function (userId, resourceId, db) {

const queryString = `
  INSERT INTO resource_ratings (user_id, resource_id, liked)
  VALUES (${userId}, ${resourceId}, TRUE)
  ON CONFLICT (user_id, resource_id)
  DO UPDATE SET liked = NOT resource_ratings.liked WHERE resource_ratings.user_id = ${userId} and resource_ratings.resource_id = ${resourceId}
  RETURNING *`;

  //let queryString = "";
  // INSERT INTO resource_ratings (user_id, resource_id, liked)
  // VALUES (1, 37, TRUE)
  // ON CONFLICT (user_id, resource_id, liked)
  // DO UPDATE SET liked = FALSE
  // WHERE resource_ratings.user_id = 1 and resource_ratings.resource_id = 37;
  // `;

  // const subQuery = db.query(`
  // SELECT liked
  // FROM resource_ratings
  // WHERE user_id = $${userId}
  // AND resource_id = $${resourceId}`);

  // if (subQuery) {
  //   queryString += `UPDATE resource_ratings SET `;

  //   if (subQuery === TRUE) {
  //     queryString += `liked = FALSE`;
  //   } else {
  //     queryString += `liked = TRUE`;
  //   }

  //   queryString += ` WHERE resource_ratings.user_id = ${userId} AND resource_ratings.resource_id = ${resourceId}  RETURNING *`;

  // } else {
  //   queryString += `
  //   INSERT INTO resource_ratings (user_id, resource_id, liked)
  //   VALUES (${userId}, ${resourceId}, TRUE)
  //   RETURNING *`;
  // }

//queryString += ` WHERE user_id = $${userId} AND resource_id = $${resourceId} RETURNING *;`

  return db.query(queryString)
    .then((res) => res.rows[0])
    .catch((error) => console.error(error));
}

//
//  Rates a resource
//
const rateAResource = function (userId, resourceId, rating, db) {
  //look for a rating by resourceid and userid and update it. If one doesn't exist, create a new one

  const queryString = `
  INSERT INTO resource_ratings (user_id, resource_id, rating)
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, resource_id)
  DO UPDATE SET rating = $3 WHERE resource_ratings.user_id = $1 and resource_ratings.resource_id = $2
  RETURNING *`;

  const queryParams = [userId, resourceId, rating];

  return db.query(queryString, queryParams).then(res => res.rows);
}

//
//  Searches all resources based on the topic
//
const searchResources = function (userId, topic, db) {

  const queryString = `
    SELECT r.*, rr.liked AS like, rr.rating AS rating, ar.avg_rating
    FROM resources r
    LEFT JOIN (SELECT * FROM resource_ratings rr2 WHERE rr2.user_id = ${userId}) rr
    ON rr.resource_id = r.id
    JOIN (SELECT resource_id, avg(rating) AS avg_rating FROM resource_ratings GROUP BY resource_id) ar
    ON ar.resource_id = r.id
    JOIN resource_categories ON resource_categories.resource_id = r.id
    JOIN categories ON categories.id = resource_categories.category_id
    WHERE LOWER(r.title) LIKE LOWER('%${topic}%')
    OR LOWER(categories.category) LIKE LOWER('%${topic}%')
  `;

  return db.query(queryString)
    .then(res => res.rows)
    .catch(error => {
      console.log("Error:", error)
    });
}

//
// Guest search
//
const guestSearch = function (topic, db) {

  const queryString = `
  SELECT r.*, ar.avg_rating
  FROM resources r
  JOIN resource_ratings ON r.id = resource_ratings.id
  JOIN (SELECT resource_id, avg(rating) AS avg_rating FROM resource_ratings GROUP BY resource_id) ar
  ON ar.resource_id = r.id
  JOIN resource_categories ON resource_categories.resource_id = r.id
  JOIN categories ON categories.id = resource_categories.category_id
  WHERE LOWER(r.title) LIKE LOWER('%${topic}%')
  OR LOWER(categories.category) LIKE LOWER('%${topic}')
  GROUP BY r.id, ar.avg_rating`

  console.log(queryString);
  return db.query(queryString)
    .then(res => res.rows)
    .catch(error => {
      console.log("Error:", error)
    });
}


//
//  Change to camel case
//
const camelCase = (str) => {
  return str.replace(/(_\w)/g, (k) => k[1].toUpperCase());
};

//
//  Gets an individual resource rating by a user
//
const getRatingByUser = function (userId, resourceId, db) {
  const queryString = `
  SELECT liked, rating
  FROM resource_ratings
  WHERE user_id = $1
  AND resource_id = $2
  `;

  return db.query(queryString, [userId, resourceId])
    .then(res => res.rows[0]);
}

//
//  Gets an all resources for a user
//
const getResourcesForUser = function (userId, db) {

  const queryString = `
  SELECT DISTINCT ON (resources.id) resources.*, resource_ratings.liked as like, resource_ratings.rating as rating, categories.category,
  AVG(resource_ratings.rating) as average_rating
  FROM resources
  JOIN resource_ratings ON resources.id = resource_ratings.resource_id
  JOIN resource_categories ON resources.id = resource_categories.resource_id
  JOIN categories ON resource_categories.category_id = categories.id
  WHERE resource_ratings.user_id = $1
  OR resources.creator_id = $1
  GROUP BY resources.id, resource_ratings.liked, resource_ratings.rating, categories.category;
  `;

  return db.query(queryString, [userId])
    .then(res => res.rows);
}

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllResources,
  addResource,
  updateUser,
  getIndividualResource,
  getAverageRatingByResource,
  addComment,
  getCommentsByResource,
  likingAResource,
  rateAResource,
  searchResources,
  camelCase,
  getRatingByUser,
  getResourcesForUser,
  getResourceCategory,
  updateResource,
  getResourceCategoryByName,
  getAllGuestResources,
  guestSearch
};
