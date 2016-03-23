/*
 * router.js
 * Handles switching between "pages" on the site, despite that we never
 * actually reload the entire page.
 */

 // Add the router to the main application (app)
app.router = Marionette.AppRouter.extend({
	
	// Define all of the page routes and the corresponding router function call
	routes: {
		"welcome" : "welcome",
		"contact" : "contact",
		"logIn"   : "logIn",
		"logOut"  : "logOut",
		"welcomeUser" : "welcomeUser"
	},
	
	// Initialize - called when the router starts up, nothing here for now
	initialize: function() {
		
	},
	
	// This is the main welcome page...
	welcome: function() {
		app.navBarSelectHome();
		console.log('Navigating to main welcome page...');
		app.showMainView(new app.views.WelcomeView());
	},

	// Page for contact info
	contact: function() {
		app.navBarSelectContact();
		console.log("Navigating to contact info page...");
		app.showMainView(new app.views.ContactView());
	},

	// Log-in page
	logIn: function() {
		app.navBarSelectInternal();
		console.log("Navigating to the log-in page...");
		app.showMainView(new app.views.LogInPortalView());
	},

	// Log-out route, then goes to welcome page
	logOut: function() {
		console.log("Logging out.");
		$.ajax({
			type: 'GET',
			url: 'api.php/logout',
			success: function(data) {
				console.log("Log-out request successful.");
			},
			complete: function(data) {
				// Whether or not successful, go ahead and navigate hom
				app.router.navigate('welcome', {trigger: true});
			}
		});
	},

	// This is the welcome page except only for those logged in...
	welcomeUser: function() {
		app.navBarSelectHome();
		console.log("Navidating to the user welcome page...");
		app.showMainView(new app.views.UserWelcomeView());
	}

});
