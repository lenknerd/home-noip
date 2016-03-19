<?php
session_start();
/* test_api.php
 * Server-side tests for application, deny access in production via .htaccess
 * David Lenkner, c. 2016
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require_once 'php/templateSpecifics.php';
require_once 'php/authentication.php';
require_once 'php/utils.php';

$app = new \Slim\App;

// Test session variables and login session functions
$app->get('/testSession', function($request, $response, $args) {

	$un = getSessionUserName();
	echo "User name is " . $un . "\n";

	if( hasValidSession() ) {
		echo "Valid session.\n";
	} else {
		echo "Invalid session.\n";
	}
});

// Test session variables alone by setting
$app->get('/setSV', function($request, $response, $args) {
	echo "4\n";
	$_SESSION["a"] = '12345';
	// echo "Okay set session var to " . $_SESSION["a"] . "\n";
});

// Test session variables alone by getting
$app->get('/getSV', function($request, $response, $args) {
	echo "SV A IS " . $_SESSION["a"];
});


// Run the application
$app->run();

?>
