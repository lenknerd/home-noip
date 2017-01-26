<?php
	session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Home Page">
	<meta name="author" content="David Lenkner">
	<link rel="icon" href="img/dl-favicon-trsl-32x32.png">

	<title>David Lenkner &middot; Home</title>

	<!-- Bootstrap core CSS -->
	<link href="css/bootstrap.min.css" rel="stylesheet">

	<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
	<link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet">

	<!-- Styles for the sticky footer template -->
	<link href="css/sticky-footer-navbar.css" rel="stylesheet">

	<!-- My styles (David Lenker's) custom to my home page site -->
	<link href="css/home.css" rel="stylesheet">

</head>

<body>

	<!-- Fixed navbar -->
	<nav class="navbar navbar-inverse navbar-fixed-top" id="fixednavbar">
	</nav>

	<!-- Begin page content -->
	<div class="container" id="main">
	</div>

	<!-- Footer; TEMPORARILY HIDDEN WHILE DEBUGGING 
	<footer class="footer" style="display: none;">
		<div class="container">
		<p class="text-muted">Copyright &copy; 2016 David Lenkner</p>
 		</div>
	</footer> -->


	<!-- Bootstrap core JavaScript -->
	<script src="js/jquery.js"></script>
	<script src="js/bootstrap.min.js"></script>

	<!-- JQuery extension for cross-origin AJAX -->
	<script type="text/javascript" src="js/jquery.ajax-cross-origin.min.js"></script>

	<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
	<script src="js/ie10-viewport-bug-workaround.js"></script>

	<!-- Marionette with Underscore templating -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.1/backbone.marionette.min.js"></script>

	<!-- Router and main app for my site -->
	<script src="js/app.js"></script>
	<script src="js/router.js"></script>

	<!-- Views javascript for the site -->
	<script src="js/views/welcome.js"></script>
	<script src="js/views/contact.js"></script>
	<script src="js/views/navbar.js"></script>
	<script src="js/views/logInPortal.js"></script>
	<script src="js/views/userWelcome.js"></script>
	<script src="js/views/newTrip.js"></script>
	<script src="js/views/viewTrip.js"></script>
	<script src="js/views/wordSwap.js"></script>

	<!-- Utilities related to commute logger -->
	<script src="js/commuteLoggerUtils.js"></script>

	<script>
		// Testing - run this when gmaps api loaded
		function gmapsAPIHasLoaded() {
			console.log("GMaps API has loaded.");
			console.log("Here is my google obj:");
			console.log(google.maps);
		}
	</script>

	<!-- Google maps API, with key AIzaSyDyPJjs1OWZq1nf7RziJcQ3JEDZOSTaOzM -->
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDyPJjs1OWZq1nf7RziJcQ3JEDZOSTaOzM&callback=gmapsAPIHasLoaded&libraries=geometry" async defer></script>

	<!-- Google charts API -->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>


</body></html>
