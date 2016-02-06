/*
 * navbar.js
 * View for the navigation bar that is fixed along the top of the site.  Note
 * that unlike most other views, does not get created/killed in router as
 * you navigate pages, but is set up and rendered at app start, stays.
 * David Lenkner, c. 2016
 */

app.views.NavbarView = Marionette.View.extend({
	
	el: '#fixednavbar', // Where it will go in index.html
	
	templateLoadFuncs: ['navbarTemplate'],
	
	initialize: function() {
	},
	
	render: function() {
		console.log("Rendering navbar view.");
		this.$el.html( this.navbarTemplate() );
	},
	
	events: {
	},
	
	// Not planning on using close, just for consistency here...
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	}
});
