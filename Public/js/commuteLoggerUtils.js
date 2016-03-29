/*
 * commuteLoggerUtils.js
 * Various utilities related to commute logger page. For instance getting
 * your location and time.
 * David Lenkner, c. 2016
 */

// Get my location and time, return in the sort of obj that could be POSt data
function getLatLongTime(runWhenDone) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var dat = new Date();
			var tim = d.getTime();
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			runWhenDone({
				time: tim,
				latitude: lat,
				longitude: lon
			});
		});
	} else {
		return false;
	}
}
