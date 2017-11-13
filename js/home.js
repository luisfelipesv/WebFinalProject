

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

	$(".closeModalBtn").click(function (e){
		console.log("close btn");
		hideModals();
	});

	$('#hoursTf').bind("enterKey",function(e){
   		updateBookingPrice();
   		console.log("updating");
	});

	$('#hoursTf').on('change', function(){
     	console.log("updating");
   });

	$('#hoursTf').keyup(function(e){
		console.log("updating");
    	if(e.keyCode == 13){
    		console.log("updating");
        	$(this).trigger("enterKey");
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
}

function presentOccupiedRoom(room) {
	addRoomNumber(room);
	console.log(room);
	var endDate = new (Function.prototype.bind.apply(Date, [null].concat(room.endDate.split(/[\s:-]/)).map(function(v,i){return i==2?--v:v}) ));
	
	var time = endDate.getHours() + ":" + endDate.getMinutes();
   	var newHtml = '<div class="roomBottomInfo">';
    newHtml += '<img class="roomImg" src="assets/clock.svg" alt="clock">';
    newHtml += '<div class="roomHour">' + time  + '</div>';
    newHtml += '</div>';
    var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("occupied");
	$(roomId).append(newHtml);
}

function presentInServiceRoom(room) {
	addRoomNumber(room);
	var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("inService");
}

function presentInRepairRoom(room) {
	addRoomNumber(room);
	var roomId = '#room' + room.id;
    $(roomId).removeClass();
    $(roomId).addClass("roomDiv");
    $(roomId).addClass("inRepair");
}

function addRoomNumber(room) {
	var newHtml = '<div class="roomNumber">' + room.id +'</div>';
	var roomId = '#room' + room.id;

	$(roomId).html(newHtml);
}

// MARK: - Show modals functions
function hideModals() {
	$("#availableModal").hide();
	$("#occupiedModal").hide();
	$("#inServiceModal").hide();
	$("#inRepairModal").hide();

}
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
    			newHtml += '<p class="modalMessage">Horas:</p>';
    			newHtml += '<input id="hoursTf" class="textField" type="text" placeholder="Horas..." onchange="updateBookingPrice()">';
    			newHtml += '<p class="modalMessage">Costo:</p>';
    			newHtml += '<p id="bookingPrice" class="modalMessage" cost="'+ data.price +'"">' + data.price + '</p>';
        		newHtml += '<button class="roundedBtn modalBtn" type="button" onclick="bookRoom(' + roomId + ')">OK</button>';
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
    		var startDate = new (Function.prototype.bind.apply(Date, [null].concat(data.startDate.split(/[\s:-]/)).map(function(v,i){return i==2?--v:v}) ));
			var startTime = startDate.getHours() + ":" + startDate.getMinutes();

    		var endDate = new (Function.prototype.bind.apply(Date, [null].concat(data.endDate.split(/[\s:-]/)).map(function(v,i){return i==2?--v:v}) ));
			var endTime = endDate.getHours() + ":" + endDate.getMinutes();

    		var newHtml = modalHeader(roomId);
   		 	newHtml += '<div class="modalBody">'
   		 		newHtml += '<p class="modalMessage">Entrada-Salida:</p>';
   		 		newHtml += '<p class="modalMessage">' + startTime + ' - '+ endTime +'</p>';
    			newHtml += '<p class="modalMessage">Horas:</p>';
    			newHtml += '<input id="extraHoursTf" class="textField" type="text" placeholder="Horas extras..." onchange="updateCheckoutPrice()">';
    			newHtml += '<p class="modalMessage">Costo:</p>';
    			newHtml += '<p id="checkoutPrice" class="modalMessage" cost="'+ data.price +'"">' + data.price + '</p>';
        		newHtml += '<button class="roundedBtn modalBtn" type="button" onclick="checkoutRoom(' + roomId + ')">OK</button>';
    		newHtml += '</div>';
			$("#occupiedModal").html(newHtml);
			$("#occupiedModal").show();
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function showInServiceModal(roomId) {
	var newHtml = modalHeader(roomId);
	newHtml += '<div class="modalBody">'
   		newHtml += '<p class="modalMessage">Cambiar estado del cuarto</p>';
   		newHtml += '<button class="roundedBtn modalBtn" type="button" onclick="makeRoomAvailable(' + roomId + ')">PONER DISPONIBLE</button>';
   		newHtml += '<button class="roundedBtn modalBtn" type="button" onclick="changeRoomToInRepair(' + roomId + ')">PONER EN REPARACION</button>';
    newHtml += '</div>';
	$("#inServiceModal").html(newHtml);
	$("#inServiceModal").show();
}

function showInRepairModal(roomId) {
	var newHtml = modalHeader(roomId);
	newHtml += '<div class="modalBody">'
   		newHtml += '<p class="modalMessage">Cambiar cuarto a disponible</p>';
   		newHtml += '<button class="roundedBtn modalBtn" type="button" onclick="makeRoomAvailable(' + roomId + ')">PONER DISPONIBLE</button>';
    newHtml += '</div>';
	$("#inRepairModal").html(newHtml);
	$("#inRepairModal").show();
}

function modalHeader(roomId) {
	var newHtml = '<div class="modalHeader">';
    newHtml += '<div class="headerText">Cuarto ' + roomId + '</div>';
    newHtml += '<span class="headerBtn"><button class="closeModalBtn" type="button" onclick="hideModals()" >X</button></div>';
    newHtml += '</div>';

    return newHtml;
}


function bookRoom(roomId) {

	var jsonToSend = {
		"roomId": roomId,
		"hours": $("#hoursTf").val(),
		"earning": $("#bookingPrice").html(),
		"action": "bookRoom"
	};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			loadRooms();
			hideModals();
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
	
}

function checkoutRoom(roomId) {
	var jsonToSend = {
		"roomId": roomId,
		"extraHours": $("#extraHoursTf").val(),
		"extraEarning": $("#checkoutPrice").html(),
		"action": "checkoutRoom"
	};
	
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			loadRooms();
			hideModals();
		},
		error: function(error){
			console.log(error);
		}
	});
}

function makeRoomAvailable(roomId){
	var jsonToSend = {
		"roomId": roomId,
		"action": "availableRoom"
	};
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			loadRooms();
			hideModals();
		},
		error: function(error){
			console.log(error);
		}
	});
}

function changeRoomToInRepair(roomId){
	var jsonToSend = {
		"roomId": roomId,
		"action": "repairRoom"
	};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			loadRooms();
			hideModals();
		},
		error: function(error){
			console.log(error);
		}
	});
}

function updateBookingPrice() {
	$cost = $("#bookingPrice").attr("cost");
	$earning = $cost * $("#hoursTf").val();
	console.log($earning );
	$("#bookingPrice").html($earning);
}


function updateCheckoutPrice() {
	$cost = $("#checkoutPrice").attr("cost");
	$earning = $cost * $("#extraHoursTf").val();
	console.log($earning );
	$("#checkoutPrice").html($earning);
}

 



