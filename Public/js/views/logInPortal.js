/*
 * logInPortal.js
 * View for logging in with uname and pwd
 * David Lenkner, c. 2016
 */

app.views.LogInPortalView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['logInPortalTemplate'],
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering login view.");
		this.$el.html( this.logInPortalTemplate() );
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
