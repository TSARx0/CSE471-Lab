Below are the MySQL commands that I used for creating database and tables using Xampp's shell. So, create them, before running "app.py" and going to "http://127.0.0.1:5000/".


CREATE DATABASE truck_rental;
USE truck_rental;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    session_token VARCHAR(255)
);

CREATE TABLE object_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO object_categories (name) VALUES
('Sofa'), ('Bed'), ('Freezer'), ('Table'), ('Chair'), ('Cupboard');

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    object_id INT,
    from_district VARCHAR(100),
    to_district VARCHAR(100),
    from_address TEXT,
    to_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (object_id) REFERENCES object_categories(id)
);
