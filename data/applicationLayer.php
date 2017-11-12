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
		case "getUser":
			getUser();
			break;
		case "postComment":
			postComment();
			break;
		case "getComments":
			getComments();
			break;

		case "getFriends":
			getFriends();
			break;
		case "getRequests":
			getRequests();
			break;
		case "requestFriendship":
			requestFriendship();
			break;
		case "acceptFriendship":
			acceptFriendship();
			break;
		case "rejectFriendship":
			rejectFriendship();
			break;
		case "searchUser":
			searchUser();
			break;
	}

	// Session logged
	function isLoggedIn(){
		session_start();
		if($_SESSION['loggedIn'] == "TRUE"){
      		$response = array("session" => 'TRUE');
      		echo json_encode($response);
    	}else{
      		$response = array("session" => 'FALSE' );
      		echo json_encode($response);
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

			echo json_encode(array("result"=> "SUCCESS", "admin"=>$result["admin"]));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function logOut(){
		session_start();

    	$_SESSION['loggedIn'] = 'FALSE';
    	$_SESSION['userId'] = -1;
   		setcookie("savedUsername", "", time() - 60 , "/"); //delete cookie

    	echo json_encode(array("success" => 'TRUE'));
	}

	function getUser(){
		session_start();
		$userId = $_SESSION['userId'];

		$result = attemptGetUser($userId);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}

	}

	function postComment(){
		session_start();
		$content = $_POST["content"];
		$userId = $_SESSION['userId'];

		$result = attemptPost($content, $userId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}


	function getComments(){
		$result = attemptGetComments();

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getFriends(){
		session_start();
		$userId = $_SESSION['userId'];

		$result = attemptGetFriends($userId);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function getRequests(){
		session_start();
		$userId = $_SESSION['userId'];

		$result = attemptGetRequests($userId);

		if ($result["status"] == 200){
			echo json_encode($result["data"]);
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function requestFriendship(){
		session_start();
		$userId = $_SESSION['userId'];
		$friendId = $_POST["friendId"];

		$result = attemptRequestFriend($userId, $friendId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function acceptFriendship(){
		session_start();
		$userId = $_SESSION['userId'];
		$friendId = $_POST["friendId"];

		$result = attemptAcceptFriend($userId, $friendId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function rejectFriendship(){
		session_start();
		$userId = $_SESSION['userId'];
		$friendId = $_POST["friendId"];

		$result = attemptRejectFriend($userId, $friendId);

		if ($result["status"] == 200){
			echo json_encode(array("result"=> "SUCCESS"));
		} else {
			genericErrorFunction($result["status"],$result["headerMsg"],$result["dieMsg"]);
		}
	}

	function searchUser(){
		session_start();
		$userId = $_SESSION['userId'];
		$text = $_POST["text"];

		$result = attemptSearchUser($userId, $text);

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
