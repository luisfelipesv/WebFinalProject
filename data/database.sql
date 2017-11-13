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
    startDate TIMESTAMP,
    endDate TIMESTAMP
);

CREATE TABLE BookingHistory (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	roomId INT NOT NULL,
	startDate TIMESTAMP NOT NULL,
	hoursBooked INT NOT NULL,
	endDate TIMESTAMP,
    earning INT NOT NULL,
    FOREIGN KEY (roomId) REFERENCES Rooms(id)
);

INSERT INTO BookingHistory(roomId, startDate, hoursBooked, endDate, earning)
VALUES  (1, '2017-04-04 5:00:00', 2, '2017-04-04 7:00:00', 200),
		(1, '2017-05-05 5:00:00', 2, '2017-05-05 7:00:00', 200),
		(11, '2017-04-04 5:00:00', 2, '2017-04-04 7:00:00', 400);

INSERT INTO Users(username, userPassword, email, firstName, lastName, admin)
VALUES  ('admin', 'admin', 'admin@mail.com', 'Nombre', 'Apellido', 1);

INSERT INTO Rooms(id, type, price, status, startDate, endDate)
VALUES  (1, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(2, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(3, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(5, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(6, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(7, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(8, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(9, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(10, 1, 100, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(11, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(12, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(13, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(14, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(15, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(16, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(17, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(18, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(19, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(20, 2, 200, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(21, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(22, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(23, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(24, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(25, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(26, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(27, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(28, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(29, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01'),
		(30, 3, 300, 1, '2000-01-01 01:01:01', '2000-01-01 01:01:01');
