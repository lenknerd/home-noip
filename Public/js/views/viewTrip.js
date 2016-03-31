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
		$.ajax({
			url: 'api.php/tripInfo',
			data: {tripid: trID},
			dataType: 'json',
			success: function(data) {
				// +++
				console.log('success GETTING TRIP INFO. Here is the data:');
				console.log(data);
			},
			error: function() {
				console.log('ERROR GETTING TRIP INFO.');
			}
		});
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	}

});
