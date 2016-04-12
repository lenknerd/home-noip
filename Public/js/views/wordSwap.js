/*
 * wordSwap.js
 * View for doing a wordSwap (replace parts of speech with random words of
 * user's choosing for funny result... like mad-libs, unsure about using their
 * name though!
 * David Lenkner, c. 2016
 */

app.views.NewTripView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['wordSwapTemplate'],

	// This view requires authentication, enforced by server by indicated here
	requiresAuth: true,
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering new trip view.");
		this.$el.html( this.newTripTemplate() );
	},
	
	events: {
		'click .start-wordswap'   : 'pickWordSwap'
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	},

	pickWordSwap: function(ev) {
		var thisView = this;
		var wSwapName = ev.data('wname');
		alert('Clicked on wname ' + wSwapName);

		// AJAX call to get the html for that particular wordswap
		$.ajax({
			type: 'GET',
			url: 'api.php/getWordSwap/' + wSwapName,
			success: function(data) {
				console.log("Got wordswap html.");
				// First fade out the selector page
				thisView.$('#wSwapChoices').fadeOut(250, function() {
					// Then put the right specific html in the latter div
					thisView.$('#specificSwap').html(data);
					// And fade that div in
					thisView.$('#specificSwap').fadeIn(250);
				});
			},
			error: function(r, m) {
				console.log('Error getting wordswap html: ' + m);
			}
		});
	},
	
	// Clear alert color
	clearAlertClass: function() {
		this.$('#trip-alert').removeClass('alert-success');
		this.$('#trip-alert').removeClass('alert-danger');
		this.$('#trip-alert').removeClass('alert-warning');
	}
});
