CREATE DATABASE IF NOT EXISTS motelSweet_db;

CREATE TABLE Users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	userPassword VARCHAR(30) NOT NULL,
	email VARCHAR(30) NOT NULL,
	firstName VARCHAR(30) NOT NULL,
	lastName VARCHAR(30) NOT NULL,
	admin INT NOT NULL -- 1: admin -- 0: employee
);

CREATE TABLE Rooms (
	id INT NOT NULL PRIMARY KEY,
	type INT NOT NULL, -- 1, 2 or 3
	price INT NOT NULL, -- linked with roomType
    status INT NOT NULL, -- 1: available, 2: occupied, 3: inService, 4: inRepair
    endDate TIMESTAMP
);

CREATE TABLE BookingHistory (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	roomId INT NOT NULL,
	startDate TIMESTAMP NOT NULL,
	hoursBooked INT NOT NULL,
	endDate TIMESTAMP,
    earning INT NOT NULL,
    extraEarning INT,
    FOREIGN KEY (roomId) REFERENCES Rooms(id)
);

INSERT INTO Users(username, userPassword, email, firstName, lastName, admin)
VALUES  ('admin', 'adminpassword', 'admin@mail.com', 'Nombre', 'apellido', 1);

INSERT INTO Rooms(id, type, price, status, endDate)
VALUES  (1, 1, 100, 1, NULL),
		(2, 1, 100, 1, NULL),
		(3, 1, 100, 1, NULL),
		(5, 1, 100, 1, NULL),
		(6, 1, 100, 1, NULL),
		(7, 1, 100, 1, NULL),
		(8, 1, 100, 1, NULL),
		(9, 1, 100, 1, NULL),
		(10, 1, 100, 1, NULL),
		(11, 2, 200, 1, NULL),
		(12, 2, 200, 1, NULL),
		(13, 2, 200, 1, NULL),
		(14, 2, 200, 1, NULL),
		(15, 2, 200, 1, NULL),
		(16, 2, 200, 1, NULL),
		(17, 2, 200, 1, NULL),
		(18, 2, 200, 1, NULL),
		(19, 2, 200, 1, NULL),
		(20, 2, 200, 1, NULL),
		(21, 3, 300, 1, NULL),
		(22, 3, 300, 1, NULL),
		(23, 3, 300, 1, NULL),
		(24, 3, 300, 1, NULL),
		(25, 3, 300, 1, NULL),
		(26, 3, 300, 1, NULL),
		(27, 3, 300, 1, NULL),
		(28, 3, 300, 1, NULL),
		(29, 3, 300, 1, NULL),
		(30, 3, 300, 1, NULL);

