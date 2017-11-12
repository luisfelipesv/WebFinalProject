CREATE DATABASE IF NOT EXISTS motelSweet_db;

CREATE TABLE motelSweet_db.Users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	userPassword VARCHAR(30) NOT NULL,
	email VARCHAR(30) NOT NULL,
	firstName VARCHAR(30) NOT NULL,
	lastName VARCHAR(30) NOT NULL,
	admin INT NOT NULL -- 1: admin -- 0: employee
);

CREATE TABLE motelSweet_db.Rooms (
	id INT NOT NULL PRIMARY KEY,
	type INT NOT NULL, -- 1, 2 or 3
	price INT NOT NULL, -- linked with roomType
    status INT NOT NULL -- 1: available, 2: occupied, 3: inService, 4: inRepair
);

CREATE TABLE motelSweet_db.BookingHistory (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	startDate TIMESTAMP NOT NULL,
	endDate TIMESTAMP,
	roomId INT NOT NULL,
    earning INT NOT NULL,
    extraEarning INT,
    FOREIGN KEY (roomId) REFERENCES Rooms(id)
);

INSERT INTO Users(username, userPassword, email, firstName, lastName, admin)
VALUES  ('admin', 'adminpassword', 'admin@mail.com', 'Nombre', 'apellido', 1);

INSERT INTO Rooms(id, type, price, status)
VALUES  (1, 1, 100, 1),
		(2, 1, 100, 1),
		(3, 1, 100, 1),
		(5, 1, 100, 1),
		(6, 1, 100, 1),
		(7, 1, 100, 1),
		(8, 1, 100, 1),
		(9, 1, 100, 1),
		(10, 1, 100, 1),
		(11, 2, 200, 1),
		(12, 2, 200, 1),
		(13, 2, 200, 1),
		(14, 2, 200, 1),
		(15, 2, 200, 1),
		(16, 2, 200, 1),
		(17, 2, 200, 1),
		(18, 2, 200, 1),
		(19, 2, 200, 1),
		(20, 2, 200, 1),
		(21, 3, 300, 1),
		(22, 3, 300, 1),
		(23, 3, 300, 1),
		(24, 3, 300, 1),
		(25, 3, 300, 1),
		(26, 3, 300, 1),
		(27, 3, 300, 1),
		(28, 3, 300, 1),
		(29, 3, 300, 1),
		(30, 3, 300, 1);

