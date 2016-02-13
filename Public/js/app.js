/*
 * app.js
 * This is the main application object, contains the router to
 * track which page you're on, also contains some application-wide data
 * David Lenkner, c. 2016
 */

// Define app as extension of Marionette Application
var app = Marionette.Application.extend({
	
	initialize: function() {
	},
	
	router: {}, // The router-to-be
	views: {}, // The views-to-be
	
	servBaseURL: "", // Base route of web service

	/* This loads all templates specified in view members of app.
	 * Good to get all template loads out of way at start. */
	loadTemplates: function(runWhenDone) {
		var deferreds = [];
		// Looping through all views in app (app.views)...
		$.each( app.views, function(i, view) {
			// Loop through names of templates used in that
			var tplNames = view.prototype.templateLoadFuncs;
			$.each( tplNames, function(j, tplName) {
				// Each template file has same name as the template function for it
				deferreds.push($.get('api.php/tpl/' + tplName, function(data) {
					view.prototype[tplName] = _.template(data);
				}, 'html'));
			});
		});
		// Makes sure the templates are done loading before we proceed
		$.when.apply(null, deferreds).done(runWhenDone);
	},
	
	/* Take a pre-defined view (usually declared in router) and show it in the
	 * main element, storing view here in app.mainView. Also close last one.
    * This handles a fade in/out animation for nicer look.  Note that also
    * fades the footer in and out to avoid a footer jump down. */
	showMainView: function(view) {
		var dur = 200;
		var ap = this;
		if(this.mainView) {
			$(".footer").fadeOut(dur/2);
			this.mainView.$el.fadeOut(dur, function(){
				console.log('Closing main view...');
				ap.mainView.close();
				ap.fadeInNewView(ap, view, dur);
			});
		} else {
			ap.fadeInNewView(ap, view, dur);
		}
	},

	/* Used in above function as callback, sets new view */
	fadeInNewView: function(ap, newView, duratn) {
		console.log('Setting new main view, invisible for now...');
		ap.mainView = newView;
		console.log('Rendering main view...');
		ap.mainView.render();
		ap.mainView.$el.fadeIn(duratn);
		$(".footer").fadeIn(duratn/2);
	}
});

// Initialize the application (declaring with "new" forces run of init)
var app = new app();

/*
 * Define things that happen when we start the application.
 * Runs when you call app.start().
 */
app.on("start", function() {
	// Set up base url of web service (test mode for now)
	app.servBaseURL = 'http://' + location.host + '/home/';
	console.log("Started with servBaseURL " + app.servBaseURL);
	
	// Load all templates, and when done...
	app.loadTemplates( function() {
		console.log("Okay, done loading templates...");
		// Start the router (this handles page navigation)
		app.router = new app.router();

		/* This keeps track of #locations so you can use back button
		 * even though there aren't any full-page refreshes */
		Backbone.history.start();
		
		/* Generate and attach menubar -- this one stays and is never killed,
		 * and is attached without using the fade in/out functions */
		app.views.navbarView = new app.views.NavbarView();
		
		// Check if we are here via https.  If so, try to log in
		if(window.location.protocol == "https:") {
			app.router.navigate('logIn', {trigger: true});
		} else {	
			// Otherwise start up on home page
			app.router.navigate('welcome', {trigger: true});
		}
	});
});

// Run the app once everything on the HTML side has loaded
$(document).on("ready", function() {
	console.log("Starting!");
	app.start();
});
