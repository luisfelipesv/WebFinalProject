
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
	var newHtml = '<div class = "report"> ';
	newHtml += '<div> Reporte Semanal </div>';
	newHtml += '<div> Tipo 1: $' + report.type1Earning + '</div>';
	newHtml += '<div> Tipo 2: $' + report.type2Earning + '</div>';
	newHtml += '<div> Tipo 3: $' + report.type3Earning + '</div>';
	newHtml += '<div> Total: $' + report.totalEarning + '</div>';
	newHtml += '</div>';
	$(".timeline").append(newHtml);
}

function presentMonthReport(report) {
	var newHtml = '<div class = "report"> ';
	newHtml += '<div> Reporte Mensual  </div>';
	newHtml += '<div> Tipo 1: $' + report.type1Earning + '</div>';
	newHtml += '<div> Tipo 2: $' + report.type2Earning + '</div>';
	newHtml += '<div> Tipo 3: $' + report.type3Earning + '</div>';
	newHtml += '<div> Total: $' + report.totalEarning + '</div>';
	newHtml += '</div>';
	$(".timeline").append(newHtml);
}

function presentYearReport(report) {
	var newHtml = '<div class = "report"> ';
	newHtml += '<div> Reporte Anual  </div>';
	newHtml += '<div> Tipo 1: $' + report.type1Earning + '</div>';
	newHtml += '<div> Tipo 2: $' + report.type2Earning + '</div>';
	newHtml += '<div> Tipo 3: $' + report.type3Earning + '</div>';
	newHtml += '<div> Total: $' + report.totalEarning + '</div>';
	newHtml += '</div>';
	$(".timeline").append(newHtml);
}
