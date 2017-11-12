<?php
	//funcion para hacer la conexion a la base de datos
	function databaseConnection(){
		$servername = 'localhost';
		$username = 'root';
		$password = 'root';
		$dbname = 'motelSweet_db';

		$conn = new mysqli($servername, $username, $password, $dbname);

		if ($conn->connect_error){
			return null;
		}

		return $conn;
	}
	//funcion que intenta hacer el registro de nuevos usuarios
	function attemptRegister($username, $email, $password, $firstName, $lastName, $admin){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Users
				WHERE username = '$username'";

		$result = $conn->query($sql);

		// Validate that user doesn't exist
		if ($result->num_rows > 0){
			$conn->close();
			return array(
				"status"=>401,
				"headerMsg"=>"Username or email already in use, please select another one.",
				"dieMsg"=>"Username or email already in use."
			);
		}

		// Insert new user
		$insert = "INSERT INTO Users(username, userPassword, email, firstName, lastName, admin)
					VALUES ('$username', '$password', '$email', '$firstName', '$lastName', '$admin')";

		$insertRes = $conn->query($insert);

		// Validate insert
		if ($insertRes){
			$response = array("status"=> 200);
			$conn->close();
			return $response;
		}

		$dieMsg = "Error: " . $insert . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>402, "headerMsg"=>"Insert error.", "dieMsg"=>$dieMsg);
	}

	function attemptLogin($username, $password){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Users
				WHERE username = '$username' AND userPassword = '$password'";

		$result = $conn->query($sql);

		// Validate user existence
		if($result->num_rows > 0){
			$ans = $result->fetch_assoc();
			$conn->close();
			return array(
				"userId"=> $ans["person_id"], 
				"admin"=> $ans["admin"],
				"status"=> 200);
		}

		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"User not found.",
			"dieMsg"=>"Wrong credentials provided"
		);
	}

	function attemptGetUser($userId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Users
				WHERE id = '$userId'";

		$result = $conn->query($sql);

		// Validate user
		if($result->num_rows > 0){
			$ans = $result->fetch_assoc();

			$user = array(
				"username"=>$ans["username"],
				"email"=>$ans["email"],
				"firstName"=>$ans["firstName"],
				"lastName"=>$ans["lastName"],
				"country"=>$ans["country"],
				"gender"=>$ans["gender"]
			);
			$conn->close();
			return array("data" => $user, "status"=>200);
		}

		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"User not found.",
			"dieMsg"=>"Wrong credentials provided"
		);
	}

	function attemptPost($content, $userId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "INSERT INTO Comments(content, userId)
				VALUES ('$content', '$userId')";

		$result = $conn->query($sql);

		if ($result){
			$conn->close();
			return array("status"=>200);
		}
		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"Insert error in DB.",
			"dieMsg"=> $dieMsg
		);
	}

	function attemptGetComments() {
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT c.id, c.content, u.id, u.username, u.firstName, u.lastName
				FROM Comments c, Users u
				WHERE u.id = c.userId
				ORDER BY c.id DESC";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$comments = array();
			while ($row = $result->fetch_assoc()){
				$comment = array(
					"content"=>$row["content"],
					"username"=>$row["username"],
					"firstName"=>$row["firstName"],
					"lastName"=>$row["lastName"]);

				array_push($comments,$comment);
			}

			$conn->close();
			return array("data" => $comments, "status"=>200);
		}


		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Insert error in Database.", "dieMsg"=>$dieMsg);

	}

	function attemptGetFriends($userId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		// TODO check sql statement
		$sql = "SELECT u.id, u.username, u.email, u.firstName, u.lastName, u.country, u.gender
				FROM Users u, Friendship f
				WHERE ('$userId' = f.userId_1 AND u.id = f.userId_2) OR ('$userId' = f.userId_2 AND u.id = f.userId_1)";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$friends = array();
			while ($row = $result->fetch_assoc()){
				$friend= array(
					"id"=>$row["id"],
					"username"=>$row["username"],
					"email"=>$row["email"],
					"firstName"=>$row["firstName"],
					"lastName"=>$row["lastName"],
					"country"=>$row["country"],
					"gender"=>$row["gender"]);

				array_push($friends,$friend);
			}

			$conn->close();
			return array("data" => $friends, "status"=>200);
		}

		$conn->close();
		return array("status"=>401, "headerMsg"=>"You don't have friends, try to add some", "dieMsg"=>"No friends");

	}

	function attemptGetRequests($userId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		// TODO check sql statement
		$sql = "SELECT u.id, u.username, u.email, u.firstName, u.lastName, u.country, u.gender
				FROM Users u, FriendRequest fr
				WHERE '$userId' = fr.toUser AND u.id = fr.fromUser";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$friends = array();
			while ($row = $result->fetch_assoc()){
				$friend= array(
					"id"=>$row["id"],
					"username"=>$row["username"],
					"email"=>$row["email"],
					"firstName"=>$row["firstName"],
					"lastName"=>$row["lastName"],
					"country"=>$row["country"],
					"gender"=>$row["gender"]);

				array_push($friends,$friend);
			}

			$conn->close();
			return array("data" => $friends, "status"=>200);
		}

		$conn->close();
		return array("status"=>401, "headerMsg"=>"You don't have friend requests", "dieMsg"=>"No friend requests");

	}

	function attemptRequestFriend($userId, $friendId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "INSERT INTO FriendRequest(fromUser, toUser)
				VALUES ('$userId', '$friendId')";

		$result = $conn->query($sql);

		if ($result){
			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"Insert error in DB.",
			"dieMsg"=> $dieMsg
		);
	}

	function attemptAcceptFriend($userId, $friendId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$delete = "DELETE FROM FriendRequest
				   WHERE fromUser = '$friendId' AND toUser = '$userId'";

		$result = $conn->query($sql);

		if (!$result){
			$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
			$conn->close();
			return array(
				"status"=>401,
				"headerMsg"=>"Couldn't update FriendRequest on DB.",
				"dieMsg"=> $dieMsg
			);
		}

		$insert = "INSERT INTO Friendship(userId_1, userId_2)
				   VALUES ('$userId', '$friendId')";

		$ans = $conn->query($insert);

		if ($ans){
			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>402,
			"headerMsg"=>"Couldn't insert Friendship on DB.",
			"dieMsg"=> $dieMsg
		);
	}

	function attemptRejectFriend($userId, $friendId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$delete = "DELETE FROM FriendRequest
				   WHERE fromUser = '$friendId' AND toUser = '$userId'";

		$result = $conn->query($sql);

		if ($result){
			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"Couldn't update FriendRequest on DB.",
			"dieMsg"=> $dieMsg
		);
	}

	function attemptSearchUser($userId, $text){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT u.id, u.username, u.email, u.firstName, u.lastName
				FROM Users u
				WHERE (u.username LIKE '%$text%' OR u.email LIKE '%$text%')
					AND NOT u.id = '$userId'
					AND NOT EXISTS (
						SELECT *
						FROM Friendship f
						WHERE (u.id = f.userId_1 AND '$userId' = f.userId_2)
							OR (u.id = f.userId_2 AND '$userId' = f.userId_1))
					AND NOT EXISTS (
						SELECT *
						FROM FriendRequest fr
						WHERE fr.fromUser = '$userId' AND u.id = fr.toUser)";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$users = array();
			while ($row = $result->fetch_assoc()){
				$user = array(
					"id"=>$row["id"],
					"username"=>$row["username"],
					"email"=>$row["email"],
					"firstName"=>$row["firstName"],
					"lastName"=>$row["lastName"]);

				array_push($users,$user);
			}

			$conn->close();
			return array("data" => $users, "status"=>200);
		}

		$conn->close();
		return array("status"=>401, "headerMsg"=>"No users with that name or email", "dieMsg"=>"No users");
	}

?>
