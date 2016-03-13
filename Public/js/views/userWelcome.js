/*
 * userWelcome.js
 * View for welcome page seen after successful log-in
 * David Lenkner, c. 2016
 */

app.views.UserWelcomeView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['loggedInWelcomeTemplate'],

	// This view requires authentication, enforced by server by indicated here
	requiresAuth: true,
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering welcome view.");
		this.$el.html( this.loggedInWelcomeTemplate() );
	},
	
	events: {
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	}
});
