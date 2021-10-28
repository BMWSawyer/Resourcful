DROP TABLE IF EXISTS resource_ratings CASCADE;

CREATE TABLE resource_ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL DEFAULT 0,
  liked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX resource_ratings_user_id_resource_id_rating ON resource_ratings (user_id, resource_id, rating);
CREATE UNIQUE INDEX resource_ratings_user_id_resource_id ON resource_ratings (user_id, resource_id);
