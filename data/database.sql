CREATE DATABASE IF NOT EXISTS motelSweet_db;

CREATE TABLE motelSweet_db.Users (
	person_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    username VARCHAR(45) NOT NULL,
    user_password VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
		tipoCuenta VARCHAR(45) NOT NULL
);
