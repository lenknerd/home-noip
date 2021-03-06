/*
 * app.js
 * This is the main application object, contains the router to
 * track which page you're on, also contains some application-wide data
 * David Lenkner, c. 2016
 */

// Define app as extension of Marionette Application
var app = Marionette.Application.extend({
	
	initialize: function() {
		this.gChartLoaded = false;
	},
	
	router: {}, // The router-to-be
	views: {}, // The views-to-be
	
	servBaseURL: "", // Base route of web service
	servBaseURL_s: "", // Same but with https method

	/* Whether logged in.  Note, also maintained on server, server deny an
	 * unauthorized request regardless of this variable.  The extra copy here
	 * is just for speed, don't have to query server to decide in normal use */
	loggedIn: false,
	userName: "",

	/* This loads all templates specified in view members of app.
	 * Good to get all template loads out of way at start.
	 * called again with reload-secure = true */
	loadTemplates: function(runWhenDone, reloadSecure) {
		if(reloadSecure === undefined) {
			reloadSecure = false;
		} else {
			reloadSecure = true;
		}
		var deferreds = [];
		// Looping through all views in app (app.views)...
		$.each( app.views, function(i, view) {
			// If you're only reloading secure views, skip ones where no auth req
			if(reloadSecure && !(view.prototype.requiresAuth) ) {
				return true; // Like "continue" but for jQuery .each
			}
			// Loop through names of templates used in that
			var tplNames = view.prototype.templateLoadFuncs;
			$.each( tplNames, function(j, tplName) {
				// Each template file has same name as the template function for it
				var tplURL = 'api.php/tpl/' + tplName;
				deferreds.push($.get(tplURL, function(data) {
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
	},

	/* Used to set navigation bar highlighted item (just visual) */
	navBarSelectHome: function() {
		this.navBarSelectNone();
		app.navbarView.$('#homecat').addClass('active');
	},

	navBarSelectResume: function() {
		this.navBarSelectNone();
		app.navbarView.$('#resumecat').addClass('active');
	},

	navBarSelectContact: function() {
		this.navBarSelectNone();
		app.navbarView.$('#contactcat').addClass('active');
	},

	navBarSelectInternal: function() {
		this.navBarSelectNone();
		app.navbarView.$('#internalcat').addClass('active');
	},

	/* Clears previous highlighted item in navbar (just visual) */
	navBarSelectNone: function() {
		app.navbarView.$('li').removeClass('active');
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
	app.servBaseURL = 'http://' + location.host;
	app.servBaseURL_s = 'https://' + location.host;
	console.log("Started with servBaseURL " + app.servBaseURL);
	
	// Load all templates, and when done...
	app.loadTemplates( function() {
		console.log("Okay, done loading templates...");

		/* Generate and attach menubar -- this one stays and is never killed,
		 * and is attached without using the fade in/out functions */
		app.navbarView = new app.views.NavbarView();
		app.navbarView.render();

		// Start the router (this handles page navigation)
		app.router = new app.router();

		/* This keeps track of #locations so you can use back button
		 * even though there aren't any full-page refreshes */
		console.log("Starting router.");
		Backbone.history.start();
		
		// Check if there is no hash in the address
		if( ! window.location.href.includes("#") ) {
			console.log("Detected no route, going to welcome.");
			// Start up on home page if no route selected
			app.router.navigate('welcome', {trigger: true});
		}
	});

	// Load google chart API any time, for use in view trip page
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(function() {
		app.gChartLoaded = true;
	});
});

// Run the app once everything on the HTML side has loaded
$(document).on("ready", function() {
	console.log("Starting!");
	app.start();
});
