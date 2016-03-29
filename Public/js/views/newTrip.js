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
		this.logging = false;
	},
	
	render: function() {
		console.log("Rendering new trip view.");
		this.$el.html( this.newTripTemplate() );
	},
	
	events: {
		'click #start-stop-trip'   : 'startOrStopLogging'
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	},

	// Start or stop logging
	startOrStopLogging: function() {
		// Lastly toggle logging status
		this.logging = ! this.logging;
	}
});
