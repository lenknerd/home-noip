/*
 * viewTrip.js
 * View for viewing statistics about travel
 * David Lenkner, c. 2016
 */

app.views.ViewTripView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['viewTripTemplate'],

	// This view requires authentication, enforced by server by indicated here
	requiresAuth: true,
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering view trip view.");
		this.$el.html( this.viewTripTemplate() );
	},
	
	events: {
		'click #submit-tripid'    : 'submitTrip'
	},

	// Submit trip ID, get info, put on map
	submitTrip: function() {
		var trID = this.$('#tripid').val();
		var thisVu = this;
		$.ajax({
			url: 'api.php/tripInfo',
			data: {tripid: trID},
			dataType: 'json',
			success: function(data) {
				console.log('Successfully retrieved trip info.');
				console.log(data);
				thisVu.showSingleTrip(data);
			},
			error: function() {
				console.log('Error getting trip info.');
			}
		});
	},

	// Show data on a google map with trip lined, plus statistics
	showSingleTrip: function(tripData) {
		console.log("Showing trip...");

		// Pull out data
		var lats = commutUtils.splitOutFloats(tripData.specifics.spaceSepLats);
		var longs = commutUtils.splitOutFloats(tripData.specifics.spaceSepLongs);
		var ts = commutUtils.splitOutFloats(tripData.specifics.spaceSepTimes);

		var tripPts = [];
		for(i = 0; i < ts.length; i++) {
			tripPts.push(
				new google.maps.LatLng(lats[i], longs[i])
			);
		}
		console.log("Here are trip points:");
		console.log(tripPts);

		// Size up the map div
		this.$('#map').css('height','300px');
		this.$('#map').css('width','400px');
		
		// Initialize map
		this.tripMap = new google.maps.Map( this.$('#map')[0], {
			zoom: 12,
			center: tripPts[0],
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		// Build google map polyline for trip
		var tripPath = new google.maps.Polyline({
			path: tripPts,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		// Go ahead and stick it on the map
		tripPath.setMap( this.tripMap );

		// Get trip statistics
		var trStats = commutUtils.basicTripStats( ts, tripPts );

		// Show the trip stats... first distances in miles
		var milesPerMeter = 0.000621371;
		var dTotal = milesPerMeter * trStats.totalD_Meters;
		var dCrow = milesPerMeter * trStats.totalDStraight_Meters;
		this.$('#d-total').text( dTotal );
		this.$('#d-ascrow').text( dCrow );

		// Next total time
		var tTotal = trStats.totalT_Mins / 60.0; // Converting to minutes
		this.$('#t-total').text( tTotal );

		// Lastly average velocity
		var tHours = tTotal / 60.0;
		var avgSpeedMPH = dTotal / tHours;
		this.$('#v-tavg').text( avgSpeedMPH );

	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	}

});
