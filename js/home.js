// Check active session
/*
$.ajax({
	url: "./data/applicationLayer.php",
	type: "POST",
	data: {"action": "isLoggedIn"},
	ContentType: "application/json",
	dataType: "json",
	success: function(data){
		console.log(data);
		if (data.session == 'FALSE') {
			window.location.replace("index.html");
		} 
	},
	error: function(error){
		console.log(error.statusText);
	}
});
*/
$(document).ready(function(){


	// Load rooms
	/*
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: {"action": "getComments"},
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			for (var i = 0; i < data.length; i++){
				var newHtml = '<div class="postDiv">'
				newHtml += '<div class="user">'
				newHtml += '<div class="name">' +  data[i].firstName + ' ' + data[i].lastName + '</div>';
				newHtml += '<div class="username"> @' + data[i].username + '</div>';
				newHtml += '</div>'
				newHtml += '<div class="comment">' +  data[i].content + '</div>';
				newHtml += '<div class="lineDivider"></div>'
					newHtml += '</div>'
				$("#postsSection").append(newHtml)
			}
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
	
	// Action when clicking the log in button
	$("#postBtn").click(function(){
		post();
	});

	$("#modalBtn").click(function (){
		$("#myModal").hide();
	});

	$(window).click( function(event){
    	if (event.target == $("#modal")) {
        	$("#myModal").hide();
    	}
	})

	$('#messageField').bind("enterKey",function(e){
   		post();
	});

	$('#messageField').keyup(function(e){
    	if(e.keyCode == 13){
        	$(this).trigger("enterKey");
    	}
	});
	*/
});


function post(){
	var message = $("#messageField").val();
		
	if (message != "") {

		var jsonToSend = {
			"content": message,
			"action": "postComment"
		};

		$.ajax({
			url: "./data/applicationLayer.php",
			type: "POST",
			data: jsonToSend,
			ContentType: "application/json",
			dataType: "json",
			success: function(data){
				postComment(message);
				$("#messageField").val("");
			},
			error: function(error){
				console.log(error.statusText);
				showModal("Database error","Please try again");
			}
		});
		
	} else {
		showModal("Empty field","You need to write a message to be able to post");
	}
}

function postComment(message) {
	
	var newHtml = '<div class="postDiv">'
	newHtml += '<div class="user">'
	newHtml += '<div class="name">' + actualName + '</div>';
	newHtml += '<div class="username"> @' + actualUsername + '</div>';
	newHtml += '</div>'
	newHtml += '<div class="comment">' +  message + '</div>';
	newHtml += '<div class="lineDivider"></div>'
	newHtml += '</div>'

	$("#postsSection").prepend(newHtml)
}

function showModal(title, message){
	console.log("showing");
	$("#modalTitle").text(title);
	$("#modalMessage").text(message);
	$("#myModal").show();
	console.log("showed");
}

// MARK: - Present rooms functions

function presentRooms(rooms){
	for (var i=0; i < rooms.length; i++){
		presentRoomCell(rooms[i]);
	}
}

function presentRoomCell(room) {
	switch (room.status) {
		case 'available':
			presentAvailableRoom(room);
			break;
		case 'occupied':
			presentOccupiedRoom(room);
			break;
		case 'inService':
			presentInServiceRoom(room);
			break;
		case 'inRepair':
			presentInRepairRoom(room);
			break;
	}
}

function presentAvailableRoom(room) {
	addRoomNumber(room);
}

function presentOccupiedRoom(room) {
	addRoomNumber(room);

   	var newHtml = '<div class="roomBottomInfo">';
    newHtml += '<img class="roomImg" src="assets/clock.svg" alt="clock">';
    newHtml += '<div class="roomHour">' + room.endHour + '</div>';
    newHtml += '</div>';
	$("#roomId").append(newHtml);
}

function presentInServiceRoom(room) {
	addRoomNumber(room);
}

function presentInRepairRoom(room) {
	addRoomNumber(room);
}

function addRoomNumber(room) {
	var newHtml = '<div class="roomNumber">' + room.id +'</div>';
	$("#roomId").html(newHtml);
}

// MARK: - Show modals functions

function showModalForRoom(roomId, status) {
	switch (status) {
		case 'available':
			showAvailableModal(roomId);
			break;
		case 'occupied':
			showOccupiedModal(roomId);
			break;
		case 'inService':
			showInServiceModal(roomId);
			break;
		case 'inRepair';
			showInRepairModal(roomId);
			break;
	}
}

function showAvailableModal(roomId) {


	var newHtml;
	newHtml += '<div class="modalHeader">';
        newHtml += '<div id="modalTitle" class="headerText">Room </div>';
    newHtml += '</div>';
    newHtml += '<div class="modalBody">'
    	newHtml += '<p id="modalMessage">Some text in the Modal Body</p>';
        newHtml += '<button id="modalBtn" class="roundedBtn" type="button" >OK</button>';
    newHtml += '</div>';
	
}

function showOccupiedModal(roomId) {

}

function showInServiceModal(roomId) {

}

function showInRepairModal(roomId) {

}

function modalHeader(roomId) {
	var newHtml;
	newHtml += '<div class="modalHeader">';
        newHtml += '<div id="modalTitle" class="headerText">Room </div>';
    newHtml += '</div>';

    return newHtml;
}



