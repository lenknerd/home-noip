/*
 * newTrip.js
 * View for starting a trip, logging location periodically
 * David Lenkner, c. 2016
 */

app.views.NewTripView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['newTripTemplate'],

	// This view requires authentication, enforced by server by indicated here
	requiresAuth: true,
	
	initialize: function() {
		// Not logging initially
		this.tripLogging = false;
		// Timer not running initially
		this.tripLogTimer = null;
		// Interval of 25 seconds for log
		this.tripLogInterval = 20000;

		// Map dimension logic
		var wTmp = window.innerWidth * 0.75;
		if(wTmp > 800) {
			wTmp = 800;
		}
		var hTmp = 0.75 * wTmp;
		this.mapDims = { wPix: wTmp, hPix: hTmp };
	},
	
	render: function() {
		console.log("Rendering new trip view.");
		this.$el.html( this.newTripTemplate() );

		// Size up the map div
		this.$('#map').css('height', this.mapDims.hPix + 'px');
		this.$('#map').css('width', this.mapDims.wPix + 'px');
		
		// Initialize map
		this.tripMap = new google.maps.Map( this.$('#map')[0], {
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		// Create a marker which will indicate current position
		var myMap = this.tripMap;
		this.cPosMarker = new google.maps.Marker( {
			position: new google.maps.LatLng(0,0),
			map: myMap
		});
	},
	
	events: {
		'click #start-stop-trip'   : 'startOrStopLogging',
		'click #trip-alert .close' : 'hideTripAlert'
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	},

	// Start or stop logging
	startOrStopLogging: function() {

		// Toggle logging status
		this.tripLogging = ! this.tripLogging;
		// Start or stop the timer
		var startElseStop = this.tripLogging;

		if(startElseStop) {
			console.log("Starting logging.");
		} else {
			console.log("Stopping logging.");
		}

		// Reset count to zero
		this.tripPointCount = 0;

		// Some convenient ternaries based on above...
		var startStopRoute = startElseStop ? 'startTrip' : 'stopTrip';
		var msgToUser = startElseStop ? 'Logging!' : 'Logging stopped.';
		var alertClass = startElseStop ? 'alert-success' : 'alert-warning';
		var thisView = this;

		// AJAX call to start or stop logging
		$.ajax({
			type: 'GET',
			url: 'api.php/' + startStopRoute,
			dataType: 'json',
			success: function(data) {
				if(data.success) {
					// Specific data is just the string which is the trip id
					thisView.$('#tripid').text( data.specifics );
					// Loggin started display in main alert box
					thisView.showTripAlert(msgToUser,alertClass);
					// And start the interval logging timer
					thisView.startOrStopTimer(startElseStop);
				} else {
					thisView.showTripAlert(data.errMessage,'alert-danger');
				}
			},
			error: function(r, m) {
				console.log('Error starting:' + m);
				thisView.showTripAlert('Error with start/stop!', 'alert-danger');
			}
		});
	},
	
	/* Start or stop logging loop... called from within ajax success in
	 * the startOrStopLogging function. */
	startOrStopTimer: function(startElseStop) {
		// Set the button label appropriately
		var btnLabel = startElseStop ? 'Stop Logging' : 'Start Logging';
		this.$('#start-stop-trip').html(btnLabel);

		if(startElseStop) {
			// Start the timer if start is being called
			var selfView = this;
			this.tripLogTimer = setInterval(
				function() { selfView.logPoint(); },
				selfView.tripLogInterval
			);
		} else {
			// Or if stop is being called, clear the timer
			clearInterval( this.tripLogTimer );
		}
	},

	// The function to log a point for where we are now
	logPoint: function() {
		console.log("Logging a commute point.");
		var thisVue = this;
		// Get latitude, longitude, and time...
		var allowed = commutUtils.getLatLongTime( function(pData) {
			// And when you do, if you do, send that point data
			thisVue.sendPoint(pData); 
		});

		// If user didn't consent to location data, show this
		if( ! allowed ) {
			thisVue.showTripAlert('Problem getting location.', 'alert-danger');
		}
	},

	// Called in callback of above function, actually sends position/time data
	sendPoint: function(pointData) {
		console.log("Going to try to send this point data:");
		console.log(pointData);
		var thisV = this;
		$.ajax({
			type: 'POST',
			url: 'api.php/logPoint',
			data: pointData,
			dataType: 'json',
			success: function(data) {
				// Increment and show how many points are logged sucessfully
				thisV.tripPointCount += 1;
				thisV.$('#nplogged').html( thisV.tripPointCount );
			},
			error: function(data) {
				console.log('ERROR IN SENDING POINT:');
				console.log(data);
				thisV.showTripAlert('Error sending location.', 'alert-danger');
			}
		});
		// After sending point, set pos marker on the map and pan to it
		var curPosish = new google.maps.LatLng( pointData.latitude,
			pointData.longitude );
		this.cPosMarker.setPosition( curPosish );
		this.tripMap.panTo( curPosish );
	},

	// Show a message in the alert box with given class
	showTripAlert: function(messa, clas) {
		this.clearAlertClass();
		this.$('#trip-alert').addClass(clas);
		this.$('#trip-alert-text').html(messa);
		this.$('#trip-alert').show();
	},

	// Hide the trip alert box
	hideTripAlert: function(ev) {
		ev.preventDefault(); // Don't kill it, just hide it
		this.$('#trip-alert').hide();
	},

	// Clear alert color
	clearAlertClass: function() {
		this.$('#trip-alert').removeClass('alert-success');
		this.$('#trip-alert').removeClass('alert-danger');
		this.$('#trip-alert').removeClass('alert-warning');
	}
});
