/*
 * wordSwap.js
 * View for doing a wordSwap (replace parts of speech with random words of
 * user's choosing for funny result... like mad-libs, unsure about using their
 * name though!
 * David Lenkner, c. 2016
 */

app.views.WordSwapView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['wordSwapTemplate'],

	// This view requires authentication, enforced by server by indicated here
	requiresAuth: true,
	
	initialize: function() {
		this.fadeDur = 300; // Fade duration in millisecs, half full in-out
	},
	
	render: function() {
		console.log("Rendering new trip view.");
		this.$el.html( this.wordSwapTemplate() );
	},
	
	events: {
		'click .start-wordswap'  : 'pickWordSwap',
		'click .ws-submit'       : 'swapWords'
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	},

	pickWordSwap: function(ev) {
		var thisView = this;
		var wSwapName = this.$(ev.currentTarget).attr('id');

		// AJAX call to get the html for that particular wordswap
		$.ajax({
			type: 'GET',
			url: 'api.php/getWordSwap/' + wSwapName,
			dataType: 'html',
			success: function(data) {
				console.log("Got wordswap html.");
				// First fade out the selector page
				thisView.$('#wSwapChoices').fadeOut(thisView.fadeDur, function() {
					// Then put the right specific html in the latter div
					thisView.$('#specificSwap').html(data);
					// And fade that div in
					thisView.$('#specificSwap').fadeIn(thisView.fadeDur);
				});
			},
			error: function(r, m) {
				console.log('Error getting wordswap html: ' + m);
			}
		});
	},
	
	// Do the word swap
	swapWords: function() {
		// Collect values from form
		var idToVal = {};
		this.$('.swap-input').each( function(index) {
			var idd = $(this).attr('id');
			// The fields to fill should have class as input ID + '_'
			idToVal[idd + '_'] = $(this).val() + '';
		});
		// Fade out the form part where they input elements
		var thisView = this;
		this.$('#wordswap-form').fadeOut(thisView.fadeDur, function() {
			// Then replace stuff in the specifics body
			for(var i in idToVal) {
				console.log('Texting class ' + i + ' with value ' + idToVal[i]);
				thisView.$('.' + i).each( function(ind) {
					$(this).text( idToVal[i] );
				});
			}
			// Capitalize or un-capitalize starts of output spans
			thisView.$('.swap-output').each( function(ind) {
				var origText = $(this).text();
				var startChar = $(this).text().slice(0,1);
				if( $(this).hasClass('upc') ) {
					var newCh = startChar.toUpperCase();
					$(this).text( newCh + origText.slice(1) );
				}
				if( $(this).hasClass('loc') ) {
					var newCh = startChar.toLowerCase();
					$(this).text( newCh + origText.slice(1) );
				}
			});
			// Then fade in the body
			thisView.$('#wordswap-body').fadeIn(thisView.fadeDur);
		});
	}

});
