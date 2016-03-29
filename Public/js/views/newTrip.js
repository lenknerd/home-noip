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
		// Interval of 5 seconds for log
		this.tripLogInterval = 5000;
	},
	
	render: function() {
		console.log("Rendering new trip view.");
		this.$el.html( this.newTripTemplate() );
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
			success: function(data) {
				thisView.showTripAlert(msgToUser,alertClass);
				thisView.startOrStopTimer(startElseStop);
			},
			error: function(data) {
				thisView.showTripAlert('Error with request!', 'alert-danger');
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
		var thisVue = this;
		// Get latitude, longitude, and time...
		var allowed = getLatLongTime( function(pData) {
			// And when you do, if you do, send that point data
			thisVue.sendPoint(pData); 
		});

		// If user didn't consent to location data, show this
		if( ! allowed ) {
			thisVue.showTripAlert('Location not allowed.', 'alert-danger');
		}
	},

	// Called in callback of above function, actually sends position/time data
	sendPoint: function(pointData) {
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
			error: function() {
				thisVue.showTripAlert('Error sending lcoation.', 'alert-danger');
			}
		});
	}

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
