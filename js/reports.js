
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

});


function loadReports() {
	loadWeekReport();

}
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
			loadMonthReport();

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
			presentMonthReport(data);
			loadYearReport();
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
			presentYearReport(data);
		},
		error: function(error){
			console.log(error.statusText);
		}
	});
}

function presentWeekReport(report) {
	console.log("Week Report");
	console.log(report.type1Earning);
	console.log(report.type2Earning);
	console.log(report.type3Earning);
	console.log(report.total);
	var newHtml = '<div class = "report"> ';
	newHtml += '<p> Reporte Semanal </p>';
	newHtml += '<p> Tipo 1: ' + report.type1Earning + '</p>';
	newHtml += '<p> Tipo 2: ' + report.type2Earning + '</p>';
	newHtml += '<p> Tipo 3: ' + report.type3Earning + '</p>';
	newHtml += '</div>';
	$(".timeline").append(newHtml);
}

function presentMonthReport(report) {
	console.log(report.type1Earning);
	console.log(report.type2Earning);
	console.log(report.type3Earning);
	console.log(report.total);
	var newHtml = '<div class = "report"> ';
	newHtml += '<p> Reporte Mensual  </p>';
	newHtml += '<p> Tipo 1: ' + report.type1Earning + '</p>';
	newHtml += '<p> Tipo 2: ' + report.type2Earning + '</p>';
	newHtml += '<p> Tipo 3: ' + report.type3Earning + '</p>';
	newHtml += '</div>';
	$(".timeline").append(newHtml);
}

function presentYearReport(report) {
	console.log(report.type1Earning);
	console.log(report.type2Earning);
	console.log(report.type3Earning);
	console.log(report.total);
	var newHtml = '<div class = "report"> ';
	newHtml += '<p> Reporte Anual  </p>';
	newHtml += '<p> Tipo 1: ' + report.type1Earning + '</p>';
	newHtml += '<p> Tipo 2: ' + report.type2Earning + '</p>';
	newHtml += '<p> Tipo 3: ' + report.type3Earning + '</p>';
	newHtml += '</div>';
	$(".timeline").append(newHtml);
}
