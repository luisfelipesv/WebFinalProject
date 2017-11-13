$(document).ready(function(){
  // Check admin
    $.ajax({
        url: "./data/applicationLayer.php",
        type: "POST",
        data: {"action": "isLoggedIn"},
        ContentType: "application/json",
        dataType: "json",
        success: function(data){
            console.log(data);
            if (data.admin == "TRUE") {
                console.log("user is admin");
                loadUsers();
            } else {
                window.location.replace("home.html");
            }
        },
        error: function(error){
            console.log(error.statusText);
            window.location.replace("index.html");
        }
    });


  $("#profileBtn").click(function(){
    $.ajax({
      url: "./data/applicationLayer.php",
      type: "POST",
      data: {"action": "logOut"},
      ContentType: "application/json",
      dataType: "json",
      success: function(data){
        alert("See you later");
        window.location.replace("index.html");
      },
      error: function(error){
        console.log("Error");
      }
    });
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
    if (!validateRadio($("input[name='job']"), $("#errorJon"))){
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
      registerUser($("#username"), $("#password"), $("#email"), $("#firstName"), $("#lastName"), $("input[name='job']"), $("#errorSignUp"), $("#passwordConfirmation"));
    }

    return false;
  });
});


function loadUsers() {
    $.ajax({
        url: "./data/applicationLayer.php",
        type: "POST",
        data: {"action": "getUsers"},
        ContentType: "application/json",
        dataType: "json",
        success: function(data){
            presentUsers(data);
        },
        error: function(error){
            window.location.replace("home.html");
        }
    });
}

function presentUsers(users) {
  $(".userSection").remove();
  for (var i=0; i < users.length; i++){
    presentUser(users[i]);
    }
}

function presentUser(user) {
  console.log(user);
    var newHtml = '<div class="userDiv">';
    newHtml += '<p> ID: ' + user.id + '</p>';
    newHtml += '<p> Username: ' + user.username + '</p>';
    newHtml += '<p> Password: ' + user.password + '</p>';
    newHtml += '</div>';
    $(".usersSection").append(newHtml);
}


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

function registerUser($usernameField, $passwordField, $emailField, $firstNameField, $lastNameField, $jobs, $errorMsg, $passwordConfirmation) {
  $errorMsg.hide();

  // Admin 1, Female 0
  var admin = $jobs.first().is(":checked") ? 1 : 0;

  var jsonToSend = {
    "username": $usernameField.val(),
    "userPassword": $passwordField.val(),
    "email": $emailField.val(),
    "firstName": $firstNameField.val(),
    "lastName": $lastNameField.val(),
    "admin": admin,
    "action": "registerUser"
  };

  $.ajax({
    url: "./data/applicationLayer.php",
    type: "POST",
    data: jsonToSend,
    ContentType: "application/json",
    dataType: "json",
    success: function(data){
      $usernameField.val("");
      $passwordField.val("");
      $emailField.val("");
      $firstNameField.val("");
      $lastNameField.val("");
      $passwordConfirmation.val("");
      loadUsers();
    },
    error: function(error){
      console.log(error.statusText);

    }
  });
}
