
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
				loadRooms();
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
		searchRoom();
	});

	$('#searchField').bind("enterKey",function(e){
   		searchRoom();
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
function logout(){
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
}
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
	$("#roomsSection").empty();
	for (var i=0; i < rooms.length; i++){
		presentRoom(rooms[i]);
	}
}

function presentRoom(room) {
	var newHtml = '<div id="room'+room.id+'" class="roomDiv" onclick="showModalForRoom('+room.id+')">';
	switch (room.status) {
		case '1':
			newHtml += '<div class="roomStatus available"></div>';
			break;
		case '2':
			newHtml += '<div class="roomStatus occupied"></div>';
			break;
		case '3':
			newHtml += '<div class="roomStatus inService"></div>';
			break;
		case '4':
			newHtml += '<div class="roomStatus inRepair"></div>';
			break;
	}
	newHtml += '<div class="roomNumber">Cuarto '+ room.id + '</div>';
	newHtml += '<div class="roomType"> Tipo '+ room.type + '</div>';
	newHtml += '<div class="roomPrice"> Precio $'+ room.price + '</div>';
	newHtml += '</div>';
	$("#roomsSection").append(newHtml);
}

// MARK: - Search room functions
function searchRoom() {
	var text = $("#searchField").val();

	if (text != "") {
		var jsonToSend = {
			"text": text,
			"action": "searchRoom"
		};

		$.ajax({
			url: "./data/applicationLayer.php",
			type: "POST",
			data: jsonToSend,
			ContentType: "application/json",
			dataType: "json",
			success: function(data){
				console.log(data);
				presentRooms(data);
			},
			error: function(error){
				console.log(error.statusText);
				showModal("Search error", error.statusText);
			}
		});

	} else {
		loadRooms();
	}
}


function showModalForRoom(roomId) {
	var jsonToSend = {
			"roomId": roomId,
			"action": "getRoomHistory"
		};

	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: jsonToSend,
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			var newHtml = '<div class="modalHeader">';
    		newHtml += '<div class="headerText">Historial Cuarto ' + roomId + '</div>';
    		newHtml += '<span class="headerBtn"><button class="closeModalBtn" type="button" onclick="hideModals()" >X</button></div>';
    		newHtml += '</div>';
   			newHtml += '<div class="modalBody">'
   			for (var i=0; i < data.length; i++){
				newHtml += presentHistory(data[i]);
			}
    		newHtml += '</div>';
    		$("#historyModal").html(newHtml);
   			$("#historyModal").show();
		},
		error: function(error){
			console.log(error.statusText);
			showModal("DB error", error.statusText);
		}
	});



}

function hideModals() {
	$("#historyModal").hide();
}

function presentHistory(room){
	var startDate = new (Function.prototype.bind.apply(Date, [null].concat(room.startDate.split(/[\s:-]/)).map(function(v,i){return i==2?--v:v}) ));
	var startTime = startDate.toLocaleDateString() + " " + startDate.toLocaleTimeString();

    var endDate = new (Function.prototype.bind.apply(Date, [null].concat(room.endDate.split(/[\s:-]/)).map(function(v,i){return i==2?--v:v}) ));
	var endTime = endDate.toLocaleDateString()  + " " + endDate.toLocaleTimeString();

	var newHtml = '<div class="history">';
	newHtml += 'Cuarto reservado de ' + startTime + ' a ' + endTime + ' por: $' + room.earning;
	newHtml += '</div>';
	return newHtml;
}
