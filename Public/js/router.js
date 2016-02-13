/*
 * router.js
 *
 * Handles switching between "pages" on the site, despite that we never
 * actually reload the entire page.
 */

 // Add the router to the main application (app)
app.router = Marionette.AppRouter.extend({
	
	// Define all of the page routes and the corresponding router function call
	routes: {
		"welcome" : "welcome",
		"contact" : "contact",
		"logIn"   : "logIn"
	},
	
	// Initialize - called when the router starts up, nothing here for now
	initialize: function() {
		
	},
	
	// This is the main welcome page...
	welcome: function() {
		console.log('Navigating to main welcome page...');
		app.showMainView(new app.views.WelcomeView());
	},

	// Page for contact info
	contact: function() {
		console.log("Navigating to contact info page...");
		app.showMainView(new app.views.ContactView());
	},

	// Log-in page
	logIn: function() {
		console.log("Navigating to the log-in page...");
		app.showMainView(new app.views.LogInPortalView());
	}

});
