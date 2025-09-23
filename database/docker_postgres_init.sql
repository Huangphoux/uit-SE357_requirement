CREATE USER me;
CREATE DATABASE client;
GRANT ALL PRIVILEGES ON DATABASE client TO me;
\c api 
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);

INSERT INTO users (name, email)
  VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');