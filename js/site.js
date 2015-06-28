/*
	jQuery SOURCE CODE Redesigned , Refactored, and fixed bugs, Added by Irfan M Saleem on 6.12.2013
	Report Bugs on :  Email : irfan_ms@yahoo.com
*/

var isRefresh = true;
var divsStr = "<div class='hadith'><p>*ICOE*</p></div>";
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var d = new Date();
var dataCache;
var configObj = {};

$(document).ready(function () {
	ReadConfig();
	SetNamazTimings();
	setInterval(function () {
		SetHadees();
	}, 50000);

	setInterval(function () {
		// Create a newDate() object and extract the minutes of the current time on the visitor's
		var minutes = new Date().getMinutes();
		// Add a leading zero to the minutes value
		$("#min").html((minutes < 10 ? "0" : "") + minutes);
	}, 1000);

	setInterval(function () {
		// Create a newDate() object and extract the hours of the current time on the visitor's
		var hours = new Date().getHours();
		if (hours > 12) {
			hours -= 12;
		} else {
			hours = hours;
		}

		if (0 == hours && new Date().getMinutes() == 0 && new Date().getSeconds() <= 1) {
			SetNamazTimings();
			SetIslamicHijriDate();
			if (configObj.Quran == 1) {
				SetQuranAyah();
			}
		}

		// Add a leading zero to the hours value
		$("#hours").html((hours < 10 ? "0" : "") + hours);
		if (hours == 0) $("#hours").html("12");
	}, 1000);

	/* Added by Irfan M Saleem on 6.11.2013*/
	function CheckSalahs() {
		var hours = new Date().getHours();
		var minutes = new Date().getMinutes();
		var actualHours = new Date().getHours();
		if (null == dataCache) SetNamazTimings();

		var dayAdhan = d.getDate();
		var calculatedHours;
		var nmzTxt = $("#fajrValue").text();
		var hoursMinutesArr = nmzTxt.split(":");
		if (actualHours >= 1 && actualHours < 11) {
			calculatedHours = parseInt(hoursMinutesArr[1]) + 8;
			if (calculatedHours >= 60) calculatedHours = calculatedHours - 60;
			if (hoursMinutesArr[0] == hours && (calculatedHours == minutes) && (nmzTxt != dataCache.fajr)) {
				$("#shuruqValueAdhan").html(dataCache.shuruq);
				$("#fajrValueAdhan").html(dataCache.fajrBegin);
				$("#fajrValue").html(dataCache.fajr);
			}
		}

		nmzTxt = $("#dhuhrValue").text();
		hoursMinutesArr = nmzTxt.split(":");
		calculatedHours = parseInt(hoursMinutesArr[1]) + 8;
		if (calculatedHours >= 60) calculatedHours = calculatedHours - 60;
		hoursMinutesArr[0] = hoursMinutesArr[0] == 1 ? parseInt(hoursMinutesArr[0]) + 12 : hoursMinutesArr[0];
		if (hoursMinutesArr[0] == hours && (calculatedHours == minutes) && (nmzTxt != dataCache.dhuhr)) {
			$("#dhuhrValueAdhan").html(dataCache.dhuhrBegin);
			$("#dhuhrValue").html(dataCache.dhuhr);
		}

		nmzTxt = $("#asrValue").text();
		hoursMinutesArr = nmzTxt.split(":");
		calculatedHours = parseInt(hoursMinutesArr[1]) + 8;
		if (calculatedHours >= 60) calculatedHours = calculatedHours - 60;
		if ((parseInt(hoursMinutesArr[0]) + 12 == hours) && (calculatedHours == minutes) && (nmzTxt != dataCache.asr)) {
			$("#asrValueAdhan").html(configObj.Hanafi ? dataCache.asrBeginHanafi : dataCache.asrBegin);
			$("#asrValue").html(dataCache.asr);
		}

		nmzTxt = $("#maghribValue").text();
		hoursMinutesArr = nmzTxt.split(":");
		calculatedHours = parseInt(hoursMinutesArr[1]) + 8;
		if (calculatedHours >= 60) calculatedHours = calculatedHours - 60;
		if ((parseInt(hoursMinutesArr[0]) + 12 == hours) && (calculatedHours == minutes) && (nmzTxt != dataCache.maghrib)) {
			$("#maghribValueAdhan").html(dataCache.maghribBegin);
			$("#sunsetValue").html(dataCache.maghribBegin);
			$("#maghribValue").html(dataCache.maghrib);
		}

		nmzTxt = $("#ishaValue").text();
		hoursMinutesArr = nmzTxt.split(":");
		calculatedHours = parseInt(hoursMinutesArr[1]) + 8;
		if (calculatedHours >= 60) calculatedHours = calculatedHours - 60;
		if ((parseInt(hoursMinutesArr[0]) + 12 == hours) && (calculatedHours == minutes) && (nmzTxt != dataCache.isha)) {
			$("#ishaValueAdhan").html(dataCache.ishaBegin);
			$("#ishaValue").html(dataCache.isha);
		}

	}

	function Update(item) {
		$("#fajrValueAdhan").html(item.fajrBegin);
		$("#fajrValue").html(item.fajr);

		$("#shuruqValueAdhan").html(item.shuruq);

		$("#dhuhrValueAdhan").html(item.dhuhrBegin);
		$("#dhuhrValue").html(item.dhuhr);

		$("#asrValueAdhan").html(configObj.Hanafi ? item.asrBeginHanafi : item.asrBegin);
		$("#asrValue").html(item.asr);

		$("#maghribValueAdhan").html(item.maghribBegin);
		$("#maghribValue").html(item.maghrib);

		$("#sunsetValue").html(item.maghribBegin);
		
		$("#ishaValueAdhan").html(item.ishaBegin);
		$("#ishaValue").html(item.isha);
	}

	function SetNamazTimings() {
		d = new Date();
		$('#todaysDate').html(dayNames[d.getDay()] + ", " + d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear());
		var month = d.getMonth() + 1;
		var nextDate = new Date();
		nextDate.setDate(nextDate.getDate() + 1);
		var nextMonth = nextDate.getMonth() + 1;
		var nextdayAdhan = nextDate.getDate();
		var dayAdhan = d.getDate();
		var urlMonthly = "data/SalahSchedules.json";

		$.getJSON(urlMonthly,
			function (data) {
				$.each(data, function (i, item) {
					if (item.month == monthNames[month - 1] && item.day == dayAdhan)
						Update(item);
					if (item.month == monthNames[nextMonth - 1] && item.day == nextdayAdhan)
						dataCache = item;
				});

			});
	}

	function SetIslamicHijriDate() {
		d = new Date();
		var month = d.getMonth() + 1;
		var dayAdhan = d.getDate();
		var urlIslamicDate = "data/islamiccalendar.json";
		$.getJSON(urlIslamicDate,
			function (data) {
				var maxItem; // the highest available hijri date in the month
				$.each(data, function (i, item) {
					if (item.month == monthNames[month - 1] && item.day <= dayAdhan) {
						if (!maxItem || maxItem.day < item.day) {
							maxItem = item;
						}
					}
				});
				
				// calculate the difference between max islamic date and today
				var dayDiff = dayAdhan - maxItem.day;
				// add the difference to max islamic date in data
				var islamicDay = maxItem.islamicDay + dayDiff;
				// create full islamic date for today
				var islamicFullDate = islamicDay + " " + maxItem.islamicFullDate;
				// show the date 
				$('#todaysIslamicDate').html(islamicFullDate);
			});
	}

	function SetQuranAyah() {
		d = new Date();
		var month = d.getMonth() + 1;
		var dayAdhan = d.getDate();
		var urlIslamicDate = "data/quran.json";
		$.getJSON(urlIslamicDate,
			function (data) {
				$.each(data, function (i, item) {
					if (item.month == monthNames[month - 1] && item.day == dayAdhan) {
						$(".hadith").html(divsStr.replace("*ICOE*", item.Ayah));
					}
				});
			}).fail(function (jqxhr, textStatus, error) {
			var err = textStatus + ', ' + error;
			console.log("Request Failed: " + err);
		});
	}

	function ReadConfig() {
		var urlConfig = "data/config.json";
		$.getJSON(urlConfig,
		function (data) {
			$.each(data, function (i, item) {
				configObj.Quran = item.Quran;
				configObj.AllDay = item.AllDay;
				configObj.Hanafi = item.Hanafi;
			});
		}).fail(function (jqxhr, textStatus, error) {
			var err = textStatus + ', ' + error;
			console.log("Request Failed: " + err);
		});
	}

	function SetHadees() {
		if (configObj.Quran == 1) {
			SetQuranAyah();
		}
		else {
			d = new Date();
			var hoursHadith = d.getHours();
			var minutes = d.getMinutes();
			$('#todaysDate').html(dayNames[d.getDay()] + ", " + d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear());
			SetIslamicHijriDate();
			var isFriday = "FRIDAY" == dayNames[d.getDay()].toUpperCase();
			$.get('data/hadees.txt', function (data) {
				var dataArr = data.split('\n');
				for (var i = 0; i < dataArr.length; i++) {
					var salahStr = dataArr[i].split('=');
					var flag = salahStr[0].toUpperCase();
					switch ($.trim(flag)) {
						case "JUMMA":
							if (isFriday) $(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;

						case "ALLDAY":
							if (configObj.AllDay == 1) $(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;

						case "FAJR":
							if (hoursHadith >= 1 && hoursHadith < 11) $(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;

						case "DUHR":
							if (hoursHadith >= 11 && hoursHadith < 14)
								$(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;

						case "ASAR":
							if (hoursHadith >= 14 && hoursHadith < 17) $(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;

						case "MAGRIB":
							if (hoursHadith >= 17 && hoursHadith < 19)
								$(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;

						case "ISHA":
							if (hoursHadith >= 19 || hoursHadith < 1) $(".hadith").html(divsStr.replace("*ICOE*", salahStr[1]));
							break;
					}
				}

				if ($(".hadith").text().indexOf("COE*") > 0)
					$(".hadith").html(divsStr.replace("*ICOE*", "Sorry, I don't have any hadees available for loading on the display!. Please check my configurations or configure hadees in my data file."));
			});
		}
		isRefresh = false;
		CheckSalahs();
	}
	if (isRefresh)
		SetHadees();
});