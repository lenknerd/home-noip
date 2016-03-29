<?php
session_start();
/* api.php
 * Main server-side API for application, directs requests to proper
 * php function, also will handle authentication via Slim middleware
 * David Lenkner, c. 2016
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require_once 'php/templateSpecifics.php';
require_once 'php/authentication.php';
require_once 'php/commuteLogger.php';
require_once 'php/utils.php';

$app = new \Slim\App;

// Route for getting an html template for use in a view
$app->get('/tpl/{name}', function($request, $response, $args) {
	$templateName = $request->getAttribute('name');
	$htdoc = new DOMDocument();
	$htdoc->validateOnParse = true;

	// Special view-specific handling... loads some template from file
	handleTemplateSpecifics($request, $response, $args, $templateName, $htdoc);

	// Return document to client
	echo $htdoc->saveHTML();
});

// Route for attempting to log in
$app->post('/login', function() {
	validateAndCreateSession($_POST['username'], $_POST['password']);
});

// Route for logging out
$app->get('/logout', function() {
	endLogInSession();
});

// Middleware function to return empty error response if not logged in
function skipIfNotLoggedIn() {
	if( ! hasValidSession() ) {
		$rsp = new JsonResponse_Basic("Authentication required for route.");
		$rsp->respondAndExit();
	}
}

// Route for starting a trip
$app->get('/startTrip', 'skipIfNotLoggedIn', function() {

});

// Route for stopping a trip
$app->get('/stopTrip', 'skipIfNotLoggedIn', function() {

});


// Run the application
$app->run();

?>
