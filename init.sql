CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  photos text[] NOT NULL,
  creditcard_type VARCHAR(255) NOT NULL,
  creditcard_number VARCHAR(255) NOT NULL,
  creditcard_name VARCHAR(255) NOT NULL,
  creditcard_expired VARCHAR(255) NOT NULL,
  creditcard_cvv VARCHAR(255) NOT NULL
);
