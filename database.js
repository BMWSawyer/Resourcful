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
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllResources = function (options, limit = 10, db) {
  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
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
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
 const addResource = function (property, db) {
  //const propertyId = Object.keys(properties).length + 1;
  //property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  return db
    .query(
      `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
      cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        property.owner_id,
        property.title,
        property.description,
        property.thumbnail_photo_url,
        property.cover_photo_url,
        property.cost_per_night,
        property.parking_spaces,
        property.number_of_bathrooms,
        property.number_of_bedrooms,
        property.country,
        property.street,
        property.city,
        property.province,
        property.post_code,
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
//  Updates an existing reservation with new information
//
const updateUser = function(newReservationData, db) {
  let queryString = `UPDATE reservations SET `;

  const queryParams = [];
  console.log(newReservationData);

  if (newReservationData.start_date) {
    queryParams.push(newReservationData.start_date);
    queryString += `start_date = $1`;

    if (newReservationData.end_date) {
      queryParams.push(newReservationData.end_date);
      queryString += `, end_date = $2`;
    }

  } else {
    queryParams.push(newReservationData.end_date);
    queryString += `end_date = $1`;
  }

  queryParams.push(newReservationData.reservation_id);
  queryString += ` WHERE id = $${queryParams.length} RETURNING *;`


  console.log(queryString);

  // console.log(queryString, queryParams);

  return db.query(queryString, queryParams)
  .then((res) => res.rows[0])
  .catch((error) => console.error(error));
}

//
//  Deletes an existing reservation
//
const deleteResource = function(reservationId, db) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1`;

  return db.query(queryString, queryParams)
  .then(() => console.log("Successfully deleted!"))
  .catch((error) => console.error(error));
}

//
//  Gets an individual reservation
//
const getIndividualResource = function(reservationId, db) {
  const queryString = `SELECT * FROM reservations WHERE reservations.id = $1`;
  return db.query(queryString, [reservationId])
    .then(res => res.rows[0]);
}

/*
 *  get reviews by property
 */
const getReviewsByResource = function(propertyId, db) {
  const queryString = `
    SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text,
    users.name, properties.title AS property_title, reservations.start_date, reservations.end_date
    FROM property_reviews
    JOIN reservations ON reservations.id = property_reviews.reservation_id
    JOIN properties ON properties.id = property_reviews.property_id
    JOIN users ON users.id = reservations.guest_id
    WHERE properties.id = $1
    ORDER BY reservations.start_date ASC;
  `;

  const queryParams = [propertyId];
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


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllResources,
  addResource,
  updateUser,
  deleteResource,
  getIndividualResource,
  getReviewsByResource,
  addComment
}
