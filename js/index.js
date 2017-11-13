// Check active session
$(document).ready(function(){
	$.ajax({
        url: "./data/applicationLayer.php",
        type: "POST",
        data: {"action": "getUsername"},
        ContentType: "application/json",
        dataType: "json",
        success: function(data){
          //alert("Cookie set: " + $("#userName").val(dataRecieved.cookieUsername));
          console.log(data);
          $("#usernameLogIn").val(data.username);
        },
        error: function(error){
          console.log(error.statusText);

        }
      });

	// Action when clicking the log in button
	$("#logInBtn").click(function(){
		var checkAccount = true

		// Validate inputs of type text/password
		if (!validateInput($("#usernameLogIn"), $("#errorUsernameLogIn"))) {
			checkAccount = false;
		}

		if (!validateInput($("#passwordLogIn"), $("#errorPasswordLogIn"))) {
			checkAccount = false;
		}

		// Validate log in
		if (checkAccount){
			logIn($("#usernameLogIn"), $("#passwordLogIn"), $("#rememberPass"), $("#errorLogIn"));
		}

		return false;
	});


// Generic function to validate an input of type text/password
// Requires the element to be validated and the element of the error span to display the message
function validateInput($field, $errorMsg){
	if ($field.val() == "") {
		$errorMsg.show();
		$field.addClass("formElementError");
		return false;
	}

	$errorMsg.hide();
	$field.addClass("formElement")
	$field.removeClass("formElementError")
	return true
}

// Function to log in
// Requires the username and password to be validated and the element of the error span to display the message
function logIn($usernameField, $passwordField, $rememberCheckbox,$errorMsg){

	$errorMsg.hide();

	var jsonToSend = {
		"username": $usernameField.val(),
		"userPassword": $passwordField.val(),
		"saveUsername": $rememberCheckbox.is(":checked"),
		"action": "logIn"
	};

	console.log(jsonToSend);

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			if(data.admin == "1")
			{
				window.location.replace("home_Admin.html");
			} else {
				window.location.replace("home.html");
			}
		},
		error: function(error){
			$errorMsg.show();
		}
	});

}


});
