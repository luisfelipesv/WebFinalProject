
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
				loadReports();
			} else {
				window.location.replace("home.html");
			}
		},
		error: function(error){
			console.log(error.statusText);
			window.location.replace("index.html");
		}
	});



});


function loadReports() {
	loadWeekReport();
	loadMonthReport();
	loadYearReport();
}

function loadWeekReport() {
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: {"action": "getWeekSummary"},
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			presentWeekReport(data);
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function loadMonthReport() {
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: {"action": "getMonthSummary"},
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			presentMonthReport(report);
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function loadYearReport() {
	$.ajax({
		url: "./data/applicationLayer.php",
		type: "POST",
		data: {"action": "getYearSummary"},
		ContentType: "application/json",
		dataType: "json",
		success: function(data){
			console.log(data);
			presentYearReport(report);
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function presentWeekReport(report) {

}

function presentMonthReport(report) {
	
}

function presentYearReport(report) {
	
}


