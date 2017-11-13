
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
	// MARK: - Actions

	// Search functions
	$(".addUserBtn").on('click', function(e){
		console.log("adding");
	});

	// Search functions
	$("#searchBtn").click(function(){
		searchUser();
	});

	$('#searchField').bind("enterKey",function(e){
   		searchUser();
	});

	$('#searchField').keyup(function(e){
    	if(e.keyCode == 13){
        	$(this).trigger("enterKey");
    	}
	});



	// Modal functions
	$("#modalBtn").click(function (){
		$("#myModal").hide();
	});

	$(window).click( function(event){
    	if (event.target == $("#modal")) {
        	$("#myModal").hide();
    	}
	});



});

function showModal(title, message){
	console.log("showing");
	$("#modalTitle").text(title);
	$("#modalMessage").text(message);
	$("#myModal").show();
	console.log("showed");
}

function searchUser(){
	var text = $("#searchField").val();

	if (text != "") {

		var jsonToSend = {
			"text": text,
			"action": "searchUser"
		};

		$.ajax({
			url: "./data/applicationLayer.php",
			type: "POST",
			data: jsonToSend,
			ContentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
				presentUsers(data);
			},
			error: function(error){
				console.log(error.statusText);
				showModal("Search error", error.statusText);
			}
		});

	} else {
		showModal("Empty field","You need to write a message to be able to post");
	}
}

function presentUsers(data){
	$("#usersSection").empty();
	for (var i = 0; i < data.length; i++){
		var newHtml = '<div id=\'' + data[i].id + '\' class="userDiv">';

			newHtml += '<div class="leftInfo">';
				newHtml += '<img id="profileImg" src="assets/profile.svg" alt="avi">';
				newHtml += '<div class="userInfo">';
					newHtml += '<div class="name">' +  data[i].firstName + ' ' + data[i].lastName + '</div>';
					newHtml += '<div class="username"> @' + data[i].username + '</div>';
					newHtml += '<div class="email">' +  data[i].email + '</div>';
				newHtml += '</div>';
			newHtml += '</div>';
			newHtml += '<div class="rightInfo">';
				newHtml += '<button class="addUserBtn" type="button" onclick="addUser(' + data[i].id  + ')"><img src="assets/add.svg" alt="avi"></button> ';
			newHtml += '</div>';
			newHtml += '<div class="lineDivider"></div>';
		newHtml += '</div>';
		$("#usersSection").append(newHtml);


	}
}

function addUser(id){
	var jsonToSend = {
		"friendId": id,
		"action": "requestFriendship"
	};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			searchUser();
		},
		error: function(error){
			console.log(error.statusText);
			showModal("Add error", error.statusText);
		}
	});
}
