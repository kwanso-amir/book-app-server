-- CREATE DATABASE bookapp;
CREATE TABLE "user"(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    image VARCHAR(1024)
);

CREATE TABLE book(
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    image VARCHAR(1024) NOT NULL
);