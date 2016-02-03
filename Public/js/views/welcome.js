/*
 * welcome.js
 * View for base of page (welcome message, what you see on first arriving)
 * David Lenkner, c. 2016
 */

app.views.WelcomeView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['welcomeTemplate'],
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering welcome view.");
		this.$el.html( this.welcomeTemplate() );
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
