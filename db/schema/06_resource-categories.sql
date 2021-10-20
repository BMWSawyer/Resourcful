DROP TABLE IF EXISTS resource_categories CASCADE;

CREATE TABLE resource_categories (
  id SERIAL PRIMARY KEY NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);
