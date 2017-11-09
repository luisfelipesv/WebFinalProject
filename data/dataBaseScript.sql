CREATE TABLE Users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(30) NOT NULL,
	userPassword VARCHAR(30) NOT NULL,
	email VARCHAR(30) NOT NULL,
	firstName VARCHAR(30) NOT NULL,
	lastName VARCHAR(30) NOT NULL,
	country VARCHAR(30) NOT NULL,
	gender INT NOT NULL
);

CREATE TABLE Comments(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	content TINYTEXT NOT NULL,
	userId INT NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE FriendRequest(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	fromUser INT NOT NULL,
    toUser INT NOT NULL,
    FOREIGN KEY(fromUser) REFERENCES Users(id),
    FOREIGN KEY(toUser) REFERENCES Users(id)
);

CREATE TABLE Friendship(
    userId_1 INT NOT NULL,
    userId_2 INT NOT NULL, 
    PRIMARY KEY(userId_1, userId_2),
    FOREIGN KEY(userId_1) REFERENCES Users(id),
    FOREIGN KEY(userId_2) REFERENCES Users(id)
);


INSERT INTO Users(username, userPassword, email, firstName, lastName, country ,gender)
VALUES  ('alfredo08', 'alfred90', 'alfredo@gmail.com', 'Alfredo', 'Salazar', 'Mexico', 1),
        ('luisfelipe', 'lfsvlfsv', 'sv.luisfelipe@gmail.com', 'Luis', 'Salazar', 'Mexico', 1);

INSERT INTO Comments(content, userId)
VALUES  ('This is my first comment', 1),
        ('I hope you like this website', 2),
        ('I am planning to add more stuff as I learn', 2),
        ('Web development is more interesting than I thought', 2);