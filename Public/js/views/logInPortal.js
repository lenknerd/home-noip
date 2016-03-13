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
		'click .subm' : 'sendUp',
		'click .nmind' : 'goHomeHTTP'
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	},

	// Event on trying to log in
	sendUp: function() {
		var uAndP = {
			'username': $('#userName').val(),
			'password': $('#password').val()
		};
		console.log("Submitting log in request...");
		console.log(uAndP);
		$.ajax({
			type: 'POST',
			url: 'api.php/login',
			data: uAndP,
			dataType: 'json',
			success: function(data) {
				// Note this is success of the query, not necessarily log-in...
				console.log("Log-in request returned.");
				if(data.success) {
					// Here's where we know username/password is correct
					console.log("Log-in info was right.");
					// Reload the login-required templates...
					app.loadTemplates( function() {
						// And when done, go to the welcomeUser page
						app.router.navigate('welcomeUser', {trigger: true} );
					}, true);
				} else {
					console.log("Something went wrong with log-in.");
					var warnHTML = '<strong>Log-in error!</strong> ';
					warnHTML += data.errMessage;
					$('#logInErrorAlert').html( warnHTML );
					$('#logInErrorAlert').show();
				}
			}
		});
	},

	// Event on cancel, go back to standard http home
	goHomeHTTP: function() {
		var fullurl = window.location.href;
		window.location.href = fullurl.replace('https','http');
	}

});
