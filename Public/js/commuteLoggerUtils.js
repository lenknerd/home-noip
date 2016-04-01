/*
 * commuteLoggerUtils.js
 * Various utilities related to commute logger page. For instance getting
 * your location and time.
 * David Lenkner, c. 2016
 */

var commutUtils = {

	// Get my location and time, return in the sort of obj that'd be POST data
	getLatLongTime: function(runWhenDone) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var d = new Date();
				var tim = d.getTime();
				var lat = position.coords.latitude;
				var lon = position.coords.longitude;
				runWhenDone({
					time: tim,
					latitude: lat,
					longitude: lon
				});
			});
			return true;
		} else {
			return false;
		}
	},

	// Processing for space-separated array encoding of floats
	splitOutFloats: function(spaceSepString) {
		var tmp = spaceSepString.split(" ").slice(0,-1);
		tmp.map(function(el){
			parseFloat(el);
		});
		return tmp;
	},

	// Processing for space-separated array encoding of ints
	splitOutInts: function(spaceSepString) {
		var tmp = spaceSepString.split(" ").slice(0,-1);
		tmp.map(function(el){
			parseInt(el);
		});
		return tmp;
	}

}
