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
			},
			function() { console.log("Error inside navigator geolocation.") },
			{
				enableHighAccuracy: true
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
	},

	// Calculate some standard stats on a single trip
	basicTripStats: function(times, pts) {
		if( !(pts.length == times.length) ) {
			console.log('Incompatible times/lengths in trip stats!');
		} else if( pts.length < 2 ) {
			console.log('Not enough points in trip (<2).');
		}
		var nP = pts.length;
		// Trip length in minutes [1000*60 to convert millisecs to min]
		var totalSeconds = (times[nP-1] - times[0]) / 1000.0;
		var totalMinutes = totalSeconds / 60.0;
		/* Calculate trip total distance travelled (includes twists/turns) */
		var totalDistanceMeters = 0.0;
		for(i = 0; i < nP-1; i++) {
			var btw2pts = google.maps.geometry.spherical.computeDistanceBetween(
				pts[i], pts[i+1] );
			totalDistanceMeters += btw2pts;
		}

		// Time-average speed
		var tAvgdSpeedMetersPerSec = totalDistanceMeters / totalSeconds;

		// Total distance in straight line (note, easily thrown off)
		var totalDStraightMeters = 
			google.maps.geometry.spherical.computeDistanceBetween(
				pts[0], pts[nP-1] );

		/* Get time per distance on each hop for table data of time vs distance
		 * but only use every nth pointto smooth 1/tinydistance spikes */
		var tvdTableData = [['Distance (mi)','Time/Distance (min/mi)']];
		var totalDistanceMiles = 0.0;
		var every = 5;
		var metPerMi = 0.000621371;
		for(i=0; i<nP-every; i=i+every) {
			var btw2pts = google.maps.geometry.spherical.computeDistanceBetween(
				pts[i], pts [i+every] ) * metPerMi;

			totalDistanceMiles += btw2pts;

			// Time difference (convert to minutes via 60000)
			var tBtwPts_mins = (times[i+every] - times[i]) / 60000.0; 
			var minsPerMile = tBtwPts_mins / btw2pts;
			tvdTableData.push( [totalDistanceMiles+0.0, minsPerMile+0.0] );
		}

		// Return all results in ob
		return {
			totalT_Mins: totalMinutes,
			totalD_Meters: totalDistanceMeters,
			totalDStraight_Meters: totalDStraightMeters,
			tAvgV_MetersPerSec: tAvgdSpeedMetersPerSec,
			tableDataTVD: tvdTableData
		};
	}

}
