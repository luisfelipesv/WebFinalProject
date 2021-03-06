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

	function attemptGetRooms(){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Rooms
				ORDER BY id ASC";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$rooms = array();
			while ($row = $result->fetch_assoc()){
				$room = array(
					"id"=>$row["id"],
					"type"=>$row["type"],
					"price"=>$row["price"],
					"status"=>$row["status"],
					"endDate"=>$row["endDate"]);

				array_push($rooms,$room);
			}

			$conn->close();
			return array("data" => $rooms, "status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Error in database", "dieMsg"=>$dieMsg);
	}

	function attemptGetAvailableRoom($roomId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Rooms
				WHERE id = '$roomId'
				ORDER BY id ASC";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$ans = $result->fetch_assoc();

			if ($ans["status"] != 1){
				$conn->close();
				return array("status"=>402, "headerMsg"=>"Room not available", "dieMsg"=>"Please update rooms info");
			}

			$room = array(
				"id"=>$ans["id"],
				"type"=>$ans["type"],
				"price"=>$ans["price"]
			);

			$conn->close();
			return array("data" => $room, "status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Error in database", "dieMsg"=>$dieMsg);
	}

	function attemptGetOccupiedRoom($roomId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Rooms
				WHERE id = '$roomId'
				ORDER BY id ASC";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$ans = $result->fetch_assoc();

			if ($ans["status"] != 2){
				$conn->close();
				return array("status"=>402, "headerMsg"=>"Room not occupied", "dieMsg"=>"Please update rooms info");
			}

			$room = array(
				"id"=>$ans["id"],
				"type"=>$ans["type"],
				"price"=>$ans["price"],
				"startDate"=>$ans["startDate"],
				"endDate"=>$ans["endDate"]
			);

			$conn->close();
			return array("data" => $room, "status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Error in database", "dieMsg"=>$dieMsg);

	}

	function attemptBookRoom($roomId, $hours, $earning){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		// Get current timestamp
    	$now = new DateTime();
		$startDate = $now->format('Y-m-d H:i:s');

		$sql = "INSERT INTO BookingHistory(roomId, startDate, hoursBooked, earning)
				VALUES ('$roomId', '$startDate', '$hours', '$earning')";

		$result = $conn->query($sql);

		if ($result){
			// Add hours to current timestamp
			$now->add(new DateInterval("PT{$hours}H"));
			$endDate = $now->format('Y-m-d H:i:s');


			$update = "UPDATE Rooms 
					   SET status = 2, startDate = '$startDate', endDate = '$endDate'
					   WHERE id = '$roomId'";

			$updateResult = $conn->query($update);

			$conn->close();
			return array("status"=>200);
		}
		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Error in database", "dieMsg"=>$dieMsg);
	}

	function attemptCheckoutRoom($roomId, $extraHours, $extraEarning){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM BookingHistory bh
				WHERE bh.roomId = '$roomId'
				ORDER BY startDate DESC
				LIMIT 1";

		$result = $conn->query($sql);


		if ($result->num_rows > 0) {
			$ans = $result->fetch_assoc();

			

			// Get values
			$bookingId = $ans["id"];
			$startDate = DateTime::createFromFormat( "Y-m-d H:i:s", $ans["startDate"]);
			$hoursBooked = $ans["hoursBooked"];
			$earning = $ans["earning"];

			// Set new values
			$hoursBooked = $hoursBooked + $extraHours;
			$earning = $earning + $extraEarning;
			$startDate->add(new DateInterval("PT{$hoursBooked}H"));
			$endDate = $startDate->format('Y-m-d H:i:s');

			$updateBooking = "UPDATE BookingHistory
							  SET hoursBooked = '$hoursBooked', endDate = '$endDate', earning = '$earning'
							  WHERE id = '$bookingId'";

			$bookingResult = $conn->query($updateBooking);



			$updateRoom = "UPDATE Rooms 
					   	   SET status = 3, startDate = '2000-01-01 01:01:01', endDate = '2000-01-01 01:01:01'
					       WHERE id = '$roomId'";

			$updateResult = $conn->query($updateRoom);

			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Error in database", "dieMsg"=>$dieMsg);
	}

	function attemptSetRoomInRepair($roomId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$updateRoom = "UPDATE Rooms
					   SET status = 4
					   WHERE id = '$roomId'";

		$result = $conn->query($updateRoom);

		if ($result){
			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"Update error in DB.",
			"dieMsg"=> $dieMsg
		);
	}

	function attemptMakeRoomAvailable($roomId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$updateRoom = "UPDATE Rooms
					   SET status = 1
					   WHERE id = '$roomId'";

		$result = $conn->query($updateRoom);

		if ($result){
			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"Update error in DB.",
			"dieMsg"=> $dieMsg
		);

	}

	function attemptGetUsers(){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Users";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$users = array();
			while ($row = $result->fetch_assoc()){
				$user = array(
					"id"=>$row["id"],
					"username"=>$row["username"],
					"email"=>$row["email"],
					"firstName"=>$row["firstName"],
					"lastName"=>$row["lastName"],
					"admin"=>$row["admin"],
					"password"=>$row["userPassword"]
				);
				array_push($users,$user);
			}

			$conn->close();
			return array("data" => $users, "status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Error in database", "dieMsg"=>$dieMsg);
	}

	function attemptDeleteUser($userId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$delete = "DELETE FROM Users
				   WHERE id = '$userId'";

		$result = $conn->query($delete);

		if ($result){
			$conn->close();
			return array("status"=>200);
		}

		$dieMsg = "Error: " . $sql . "\n" . mysql_error($conn);
		$conn->close();
		return array(
			"status"=>401,
			"headerMsg"=>"Couldn't delete user from DB.",
			"dieMsg"=> $dieMsg
		);

	}

	function attemptSearchRoom($text){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM Rooms
				WHERE id = '$text'";



		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$rooms = array();
			while ($row = $result->fetch_assoc()){
				$room = array(
					"id"=>$row["id"],
					"type"=>$row["type"],
					"price"=>$row["price"],
					"status"=>$row["status"],
					"endDate"=>$row["endDate"]);

				array_push($rooms,$room);
			}

			$conn->close();
			return array("data" => $rooms, "status"=>200);
		}

		$conn->close();
		return array("status"=>401, "headerMsg"=>"No se encontraron cuartos con ese texto", "dieMsg"=>"No users");
	}

	function attemptGetWeekSummary(){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$type1Earning = 0;
		$type2Earning = 0;
		$type3Earning = 0;

		$sql1 = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE WEEK(bh.startDate) = WEEK(CURRENT_DATE())
					AND MONTH(bh.startDate) = MONTH(CURRENT_DATE())
					AND YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 1";
		$result1 = $conn->query($sql1);
		$ans1 = $result1->fetch_assoc();
		$type1Earning += $ans1["totalEarning"];

		$sql2 = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE WEEK(bh.startDate) = WEEK(CURRENT_DATE())
					AND MONTH(bh.startDate) = MONTH(CURRENT_DATE())
					AND YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 2";
		$result2 = $conn->query($sql2);
		$ans2 = $result2->fetch_assoc();
		$type2Earning += $ans2["totalEarning"];

		$sql3 = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE WEEK(bh.startDate) = WEEK(CURRENT_DATE())
					AND MONTH(bh.startDate) = MONTH(CURRENT_DATE())
					AND YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 3";
		$result3 = $conn->query($sql3);
		$ans3 = $result3->fetch_assoc();
		$type3Earning += $ans3["totalEarning"];

		$totalEarning = $type1Earning + $type2Earning + $type3Earning;

		$conn->close();
		return array(
			"type1Earning" => $type1Earning,
			"type2Earning" => $type2Earning,
			"type3Earning" => $type3Earning,
			"totalEarning" => $totalEarning,
			"status"=>200);
	}

	function attemptGetMonthSummary(){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$type1Earning = 0;
		$type2Earning = 0;
		$type3Earning = 0;

		$sql = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE MONTH(bh.startDate) = MONTH(CURRENT_DATE())
					AND YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 1";
		$result = $conn->query($sql);
		$ans = $result->fetch_assoc();
		$type1Earning += $ans["totalEarning"];

		$sql = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE MONTH(bh.startDate) = MONTH(CURRENT_DATE())
					AND YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 2";
		$result = $conn->query($sql);
		$ans = $result->fetch_assoc();
		$type2Earning += $ans["totalEarning"];

		$sql = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE MONTH(bh.startDate) = MONTH(CURRENT_DATE())
					AND YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 3";
		$result = $conn->query($sql);
		$ans = $result->fetch_assoc();
		$type3Earning += $ans["totalEarning"];

		$totalEarning = $type1Earning + $type2Earning + $type3Earning;

		$conn->close();
		return array(
			"type1Earning" => $type1Earning,
			"type2Earning" => $type2Earning,
			"type3Earning" => $type3Earning,
			"totalEarning" => $totalEarning,
			"status"=>200);
	}

	function attemptGetYearSummary(){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$type1Earning = 0;
		$type2Earning = 0;
		$type3Earning = 0;

		$sql = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 1";
		$result = $conn->query($sql);
		$ans = $result->fetch_assoc();
		$type1Earning += $ans["totalEarning"];

		$sql = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 2";
		$result = $conn->query($sql);
		$ans = $result->fetch_assoc();
		$type2Earning += $ans["totalEarning"];

		$sql = "SELECT SUM(bh.earning) AS totalEarning
				FROM BookingHistory bh, Rooms r
				WHERE YEAR(bh.startDate) = YEAR(CURRENT_DATE())
					AND r.id = bh.roomId
					AND r.type = 3";
		$result = $conn->query($sql);
		$ans = $result->fetch_assoc();
		$type3Earning += $ans["totalEarning"];

		$totalEarning = $type1Earning + $type2Earning + $type3Earning;

		$conn->close();
		return array(
			"type1Earning" => $type1Earning,
			"type2Earning" => $type2Earning,
			"type3Earning" => $type3Earning,
			"totalEarning" => $totalEarning,
			"status"=>200);
	}

	function attemptGetRoomHistory($roomId){
		$conn = databaseConnection();
		if ($conn == null){
			return array("status"=> 500);
		}

		$sql = "SELECT *
				FROM BookingHistory bh
				WHERE bh.roomId = '$roomId'
				ORDER BY startDate DESC
				LIMIT 5";

		$result = $conn->query($sql);

		if ($result->num_rows > 0){
			$histories = array();
			while ($row = $result->fetch_assoc()){
				$history = array(
					"id"=>$row["id"],
					"roomId"=>$row["roomId"],
					"startDate"=>$row["startDate"],
					"endDate"=>$row["endDate"],
					"earning"=>$row["earning"]
				);

				array_push($histories,$history);
			}

			$conn->close();
			return array("data" => $histories, "status"=>200);
		}

		
		$conn->close();
		return array("status"=>401, "headerMsg"=>"Este cuarto no tiene historial", "dieMsg"=>"Cuarto sin historial");
	}

?>
