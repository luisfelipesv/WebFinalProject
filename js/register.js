$(document).ready(function(){
  $("#registerButton").click(function(){
    var username = $("#createUserName").val();
    var password = $("#password").val();
    var firstname = $("#firstName").val();
    var lastname = $("#lastName").val();
    var email = $("#email").val();
    var passwordConfirmation = $("#passwordConfirmation").val();
    var tipoCuenta = $("input[name='cuenta']").first().is(":checked") ? "administrador" : "empleado";

    var jsonToSend = {
      "uName": username,
      "uPassword": password,
      "fName": firstname,
      "lName": lastname,
      "email": email,
      "passwordConf": passwordConfirmation,
      "tipoCuenta": tipoCuenta,
      "action": "registerUser"
    };

    $.ajax({
      url: "./Data/applicationLayer.php",
      type: "POST",
      data: jsonToSend,
      ContentType: "application/json",
      dataType: "json",
      success: function(dataReceived){
        alert("Welcome ");
        window.location = "home_Admin.html";
      },
      error: function(errorMessage){
        alert(errorMessage.statusText);
        console.log("error");
      }
    });
  });
});
