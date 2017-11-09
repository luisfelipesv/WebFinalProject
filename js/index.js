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

	// Action when clicking the sign up button
	$("#signUpBtn").click(function(){
		var validAccount = true;
		var emptyPassword = false;

		// Validate first name
		if (!validateInput($("#firstName"), $("#errorFirstName"))){
			validAccount = false;
		}
		// Validate last name
		if (!validateInput($("#lastName"), $("#errorLastName"))){
			validAccount = false;
		} 
		// Validate username
		if (!validateInput($("#username"), $("#errorUsername"))){
			validAccount = false;
		} 
		//Validate email
		if(!validateInput($("#email"), $("#errorEmail"))) {
			validAccount = false;
		}
			
		// Validate password
		if (!validateInput($("#password"), $("#errorPassword"))){
			validAccount = false;
			emptyPassword = true;
		}
		// Validate password confirmation
		if (!validateInput($("#passwordConfirmation"), $("#errorPasswordConfirmation"))){
			validAccount = false;
			emptyPassword = true;
		}

		// Validate the radio buttons of gender
		if (!validateRadio($("input[name='gender']"), $("#errorGender"))){
			validAccount = false;
		}

		// Validate the dropdown menu of countries
		if (!validateDropdownMenu($("#country"), $("#errorCountry"))){
			validAccount = false;
		}

		if (!emptyPassword) {
			// Validate same password
			if (!validatePasswords($("#password"),$("#passwordConfirmation"),$("#errorSamePassword"))){
				validAccount = false;
			}
		} else {
			$("#errorSamePassword").hide()
		}

		if (validAccount) {
			registerUser($("#username"), $("#password"), $("#email"), $("#firstName"), $("#lastName"), $("#country"), $("input[name='gender']"), $("#errorSignUp"));
		}

		return false;
	});

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

// Generic function to validate two password inputs
// Requires both of the password inputs and the element of the error span to display the message
function validatePasswords($field1, $field2, $errorMsg){
	if ($field1.val() != $field2.val()){
		$errorMsg.show()
		return false
	} 

	$errorMsg.hide()
	return true
}

// Generic function to validate a group of radio buttons
// Requires the group of radio buttons and the element of the error span to display the message
function validateRadio($radioElements, $errorMsg){

	if (!$radioElements.is(":checked")){
		$errorMsg.show()
		return false
	}
	
	$errorMsg.hide()
	return true
}

// Generic function to validate a the options in a dropdown menu
// Requires the element of the dropdown menu and the element of the error span to display the message
function validateDropdownMenu($dropdownElement, $errorMsg) {
	if ($dropdownElement.val() == "0"){
		$errorMsg.show()
		return false
	}

	$errorMsg.hide()
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
			
			window.location.replace("home.html");
		},
		error: function(error){
			$errorMsg.show();
		}
	});
	
}

function registerUser($usernameField, $passwordField, $emailField, $firstNameField, $lastNameField, $country, $genders, $errorMsg) {
	$errorMsg.hide();

	// Male 1, Female 0
	var gender = $genders.first().is(":checked") ? 1 : 0;

	var jsonToSend = {
		"username": $usernameField.val(), 
		"userPassword": $passwordField.val(),
		"email": $emailField.val(),
		"firstName": $firstNameField.val(),
		"lastName": $lastNameField.val(),
		"country": $country.val(),
		"gender": gender,
		"action": "registerUser"
	};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			window.location.replace("home.html");
		},
		error: function(error){
			console.log(error.statusText);
			$errorMsg.show();
		}
	});
}





