/*
 * viewTrip.js
 * View for viewing statistics about travel
 * David Lenkner, c. 2016
 */

app.views.ViewTripView = Marionette.View.extend({
	
	el: '#main', // Where it will go in index.html
	
	templateLoadFuncs: ['viewTripTemplate'],

	// This view requires authentication, enforced by server by indicated here
	requiresAuth: true,
	
	initialize: function() {
		// Map dimension logic
		var wTmp = window.innerWidth * 0.75;
		if(wTmp > 800) {
			wTmp = 800;
		}
		var hTmp = 0.75 * wTmp;
		this.mapDims = { wPix: wTmp, hPix: hTmp };
	},
	
	render: function() {
		console.log("Rendering view trip view.");
		this.$el.html( this.viewTripTemplate() );
	},
	
	events: {
		'click #submit-tripid'    : 'submitTrip'
	},

	// Submit trip ID, get info, put on map
	submitTrip: function() {
		var trID = this.$('#tripid').val();
		var thisVu = this;
		$.ajax({
			url: 'api.php/tripInfo',
			data: {tripid: trID},
			dataType: 'json',
			success: function(data) {
				console.log('Successfully retrieved trip info.');
				// console.log(data);
				thisVu.showSingleTrip(data);
			},
			error: function() {
				console.log('Error getting trip info.');
			}
		});
	},

	// Show data on a google map with trip lined, plus statistics
	showSingleTrip: function(tripData) {
		console.log("Showing trip...");

		// Pull out data
		var lats = commutUtils.splitOutFloats(tripData.specifics.spaceSepLats);
		var longs = commutUtils.splitOutFloats(tripData.specifics.spaceSepLongs);
		var ts = commutUtils.splitOutFloats(tripData.specifics.spaceSepTimes);

		var tripPts = [];
		for(i = 0; i < ts.length; i++) {
			tripPts.push(
				new google.maps.LatLng(lats[i], longs[i])
			);
		}
		console.log("Here are trip points:");
		console.log(tripPts);

		// Size up the map div
		this.$('#map').css('height', this.mapDims.hPix + 'px');
		this.$('#map').css('width', this.mapDims.wPix + 'px');
		
		// Initialize map
		this.tripMap = new google.maps.Map( this.$('#map')[0], {
			zoom: 12,
			center: tripPts[0],
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		// Build google map polyline for trip
		var tripPath = new google.maps.Polyline({
			path: tripPts,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		// Go ahead and stick it on the map
		tripPath.setMap( this.tripMap );

		// Get trip statistics
		var trStats = commutUtils.basicTripStats( ts, tripPts );

		// Show the trip stats... first distances in miles
		var milesPerMeter = 0.000621371;
		var dTotal = milesPerMeter * trStats.totalD_Meters;
		var dCrow = milesPerMeter * trStats.totalDStraight_Meters;
		this.$('#d-total').text( dTotal );
		this.$('#d-ascrow').text( dCrow );

		// Next total time
		this.$('#t-total').text( trStats.totalT_Mins );

		// Average velocity
		var tHours = trStats.totalT_Mins / 60.0;
		var avgSpeedMPH = dTotal / tHours;
		this.$('#v-tavg').text( avgSpeedMPH );

		/* After all those numric stats, show chart of T vs D... but wait a bit
		 * for chart module to load if needed (a sec at most seems okay) */
		var thisv = this;
		if( ! app.gChartLoaded ) {
			setTimeout( function() {
				thisv.showTVDChart(trStats.tableDataTVD);
			}, 1000 );
		} else {
			this.showTVDChart(trStats.tableDataTVD);
		}
	},

	// Show chart of time vs distance for given trip points and times
	showTVDChart: function(tableDataTVD) {
		console.log("Showing trip time vs distance chart.");

		// Create data and formatting options
		var chartData = google.visualization.arrayToDataTable(tableDataTVD);
		var options = {
			title: 'Time vs Distance',
			hAxis: {title: 'Distance (mi)',  titleTextStyle: {color: '#333'}},
			vAxis: {title: 'Time Density (min/mi)', minValue: 0}
		};

		// Size up the chart div if not sized already (make same size as map)
		this.$('#tvd-chart').css('height', this.mapDims.hPix + 'px');
		this.$('#tvd-chart').css('width', this.mapDims.wPix + 'px');

		// Actually draw the chart
		var chart = new google.visualization.AreaChart(
			this.$('#tvd-chart')[0];
		);
		chart.draw(chartData, options);
	},
	
	// Empty out main element
	close: function() {
		this.undelegateEvents();
		$(this).empty();
		this.unbind();
	}

});
