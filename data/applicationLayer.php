<?php
	header('Content-type: application/json');
	header('Accept: application/json');
	require_once __DIR__ . '/dataLayer.php';

	$action = $_POST["action"];

	switch($action){
		case "isLoggedIn":
			isLoggedIn();
			break;
		case "getUsername":
			getCookieUsername();
			break;
		case "registerUser":
			registerUser();
			break;
		case "logIn":
			logIn();
			break;
		case "logOut":
			logOut();
			break;
		case "getRooms":
			getRooms();
			break;
		case "getAvailableRoom":
			getAvailableRoom();
			break;
		case "getOccupiedRoom":
			getOccupiedRoom();
			break;
		case "bookRoom":
			bookRoom();
			break;
		case "checkoutRoom":
			checkoutRoom();
			break;
		case "repairRoom":
			setRoomInRepair();
			break;
		case "availableRoom":
			makeRoomAvailable();
			break;
		case "getUsers":
			getUsers();
			break;
		case "deleteUser":
			deleteUser();
			break;
		case "searchRoom":
			searchRoom();
			break;
		case "getWeekSummary":
			getWeekSummary();
			break;
		case "getMonthSummary":
			getMonthSummary();
			break;
		case "getYearSummary":
			getYearSummary();
			break;
		case "getRoomHistory":
			getRoomHistory();
			break;
	}

	// Session logged
	function isLoggedIn(){
		session_start();
		if($_SESSION['loggedIn'] == "TRUE"){
			if($_SESSION['admin'] == "TRUE"){
      			echo json_encode(array("session" => 'TRUE', "admin"=> "TRUE"));
    		} else {
    			echo json_encode(array("session" => 'TRUE', "admin"=> "FALSE"));
    		}
    	}else{
      		genericErrorFunction(401, "User not logged in", "The user needs to log in");
    	}
	}

	// Cookie username
	function getCookieUsername(){
		session_start();
		if (isset($_COOKIE["savedUsername"])) {
     		echo json_encode(array("username" => $_COOKIE["savedUsername"]));
    	} else {
      		genericErrorFunction(401, "Cookie not set", "No username saved");
    	}
	}

	function registerUser(){
		$username = $_POST['username'];
		$email = $_POST['email'];
		$password = $_POST["userPassword"];
		$firstName = $_POST["firstName"];
        $lastName = $_POST["lastName"];
		$admin = $_POST["admin"];

		$result = attemptRegister($username, $email, $password, $firstName, $lastName, $admin);

      	if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}

	}

	function logIn(){
		$username = $_POST["username"];
		$password = $_POST["userPassword"];

		$result = attemptLogin($username, $password);

		if ($result["status"] == 200){
      		session_start();
			$_SESSION['userId'] = $result["userId"];
			$_SESSION['loggedIn'] = "TRUE";

			$saveUsername = $_POST["saveUsername"];

			if ($saveUsername == "true") {
				setcookie("savedUsername", $username, time() + 2592000, "/"); // 2592000 is equivalent to 30 days
			}
			if ($result["admin"] == 1) {
				$_SESSION['admin'] = "TRUE";
			} else {
				$_SESSION['admin'] = "FALSE";
			}

			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function logOut(){
		session_start();

    	$_SESSION['loggedIn'] = 'FALSE';
    	$_SESSION['userId'] = -1;
    	$_SESSION['admin'] = '';
   		setcookie("savedUsername", "", time() - 60 , "/"); //delete cookie

    	echo json_encode(array("success" => 'TRUE'));
	}

	function getRooms(){
		$result = attemptGetRooms();

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getAvailableRoom(){
		$roomId = $_POST["roomId"];

		$result = attemptGetAvailableRoom($roomId);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getOccupiedRoom(){
		$roomId = $_POST["roomId"];

		$result = attemptGetOccupiedRoom($roomId);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}
	function bookRoom(){
		$roomId = $_POST["roomId"];
		$hours = $_POST["hours"];
		$earning = $_POST["earning"];

		$result = attemptBookRoom($roomId, $hours, $earning);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}
	function checkoutRoom(){
		$roomId = $_POST["roomId"];
		$extraHours = $_POST["extraHours"];
		$extraEarning = $_POST["extraEarning"];

		$result = attemptCheckoutRoom($roomId, $extraHours, $extraEarning);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function setRoomInRepair(){
		$roomId = $_POST["roomId"];

		$result = attemptSetRoomInRepair($roomId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function makeRoomAvailable(){
		$roomId = $_POST["roomId"];

		$result = attemptMakeRoomAvailable($roomId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getUsers(){
		$result = attemptGetUsers();

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function deleteUser(){
		$userId = $_POST["userId"];

		$result = attemptDeleteUser($userId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}


	function searchRoom(){
		$text = $_POST["text"];

		$result = attemptSearchRoom($text);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getWeekSummary() {
		$result = attemptGetWeekSummary();

		if ($result["status"] == 200){
			echo json_encode(array(
				"type1Earning" => $result["type1Earning"],
				"type2Earning" => $result["type2Earning"],
				"type3Earning" => $result["type3Earning"],
				"totalEarning" => $result["totalEarning"]
			));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getMonthSummary(){
		$result = attemptGetMonthSummary();

		if ($result["status"] == 200){
			echo json_encode(array(
				"type1Earning" => $result["type1Earning"],
				"type2Earning" => $result["type2Earning"],
				"type3Earning" => $result["type3Earning"],
				"totalEarning" => $result["totalEarning"]
			));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getYearSummary(){
		$result = attemptGetYearSummary();

		if ($result["status"] == 200){
			echo json_encode(array(
				"type1Earning" => $result["type1Earning"],
				"type2Earning" => $result["type2Earning"],
				"type3Earning" => $result["type3Earning"],
				"totalEarning" => $result["totalEarning"]
			));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getRoomHistory(){
		$roomId = $_POST["roomId"];

		$result = attemptGetRoomHistory($roomId);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	// ERROR HANDLER
	function genericErrorFunction($status, $headerMsg, $dieMsg){
		if ($status == 500) {
			header("HTTP/1.1 500 Bad connection, portal down");
			die("The server is down, we couldn't stablish the data base connection.");
		} else {
			header("HTTP/1.1 $status $headerMsg");
			die("$dieMsg");
		}
	}

?>
