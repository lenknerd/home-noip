/*
 * contact.js
 * View for contact info
 * David Lenkner, c. 2016
 */

app.views.ContactView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['contactTemplate'],
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering contact view.");
		this.$el.html( this.contactTemplate() );
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
