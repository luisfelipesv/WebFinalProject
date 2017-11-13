

$(document).ready(function(){
	// Check active session
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: {"action": "isLoggedIn"},
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			loadRooms();
			if (data.admin == "TRUE") {
				console.log("user is admin");
				$(".leftMenu").show();
			} else {
				console.log("user is not admin");
				$(".leftMenu").hide();
			}
		},
		error: function(error){
			console.log(error.statusText);
			window.location.replace("index.html");
		}
	});


	// MARK: - Actions

	$(".roomDiv").click(function (e){
		var roomId = e.currentTarget.id.substring(4);
		var roomType = e.currentTarget;
		console.log(roomType);
		showModalForRoom(roomId, e);
	});

});


function showModal(title, message){
	console.log("showing");
	$("#modalTitle").text(title);
	$("#modalMessage").text(message);
	$("#myModal").show();
	console.log("showed");
}

// MARK: - Present rooms functions
function loadRooms(){
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: {"action": "getRooms"},
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			presentRooms(data);
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function presentRooms(rooms){
	for (var i=0; i < rooms.length; i++){
		presentRoomCell(rooms[i]);
	}
}

function presentRoomCell(room) {
	switch (room.status) {
		case '1':
			presentAvailableRoom(room);
			break;
		case '2':
			presentOccupiedRoom(room);
			break;
		case '3':
			presentInServiceRoom(room);
			break;
		case '4':
			presentInRepairRoom(room);
			break;
	}
}

function presentAvailableRoom(room) {
	addRoomNumber(room);
	var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("available");

    //$(roomId).setAttribute("onclick", "showModalForRoom(' + room.id  + ',' + 'available' ')");
}

function presentOccupiedRoom(room) {
	addRoomNumber(room);

   	var newHtml = '<div class="roomBottomInfo">';
    newHtml += '<img class="roomImg" src="assets/clock.svg" alt="clock">';
    newHtml += '<div class="roomHour">' + room.endHour + '</div>';
    newHtml += '</div>';
    var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("occupied");
	$(roomId).append(newHtml);
	$(roomId).setAttribute("onclick", "showModalForRoom(' + room.id  + ',' + 'occupied' ')");
}

function presentInServiceRoom(room) {
	addRoomNumber(room);
	var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("inService");

    $(roomId).setAttribute("onclick", "showModalForRoom(' + room.id  + ',' + 'inService' ')");
}

function presentInRepairRoom(room) {
	addRoomNumber(room);
	var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("inRepair");
    $(roomId).setAttribute("onclick", "showModalForRoom(' + room.id  + ',' + 'inRepair' ')");
}

function addRoomNumber(room) {
	var newHtml = '<div class="roomNumber">' + room.id +'</div>';
	var roomId = '#room' + room.id;

	$(roomId).html(newHtml);
}

// MARK: - Show modals functions

function showModalForRoom(roomId, event) {
	var roomType = event.currentTarget.className;
	console.log(roomType);

	if (roomType.indexOf("available") != -1) {
		showAvailableModal(roomId);
	} else if (roomType.indexOf('occupied') != -1) {
		showOccupiedModal(roomId);
	} else if (roomType.indexOf('inService') != -1) {
		showInServiceModal(roomId);
	} else if (roomType.indexOf('inRepair') != -1) {
		showInRepairModal(roomId);
	}

}

function showAvailableModal(roomId) {
	//funcion ajax
	var jsonToSend = {
		"roomId": roomId,
		"action": "getAvailableRoom"
	};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			var newHtml = modalHeader(roomId);
   		 	newHtml += '<div class="modalBody">'
    			newHtml += '<p id="modalMessage">Some text in the Modal Body</p>';
        		newHtml += '<button id="modalBtn" class="roundedBtn" type="button" >OK</button>';
    		newHtml += '</div>';
    		$("#availableModal").html(newHtml);
    		$("#availableModal").show();
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
	
}

function showOccupiedModal(roomId) {
	var jsonToSend = {
		"roomId": roomId,
		"action": "getOccupiedRoom"
	};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			$("#occupiedModal").show();
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function showInServiceModal(roomId) {
	//open In service popup
	$("#inServiceModal").show();
}

function showInRepairModal(roomId) {
	// open in repair popup
	$("#inRepairModal").show();
}

function modalHeader(roomId) {
	var newHtml = '<div class="modalHeader">';
    newHtml += '<div class="headerText">Room ' + roomId + '</div>';
    newHtml += '<span class="headerBtn"></div>';
    newHtml += '</div>';

    return newHtml;
}


function bookRoom() {

}

function checkoutRoom() {

}


 



