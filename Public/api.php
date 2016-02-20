<?php
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

$app = new \Slim\App;

// Route for getting an html template for use in a view
$app->get('/tpl/{name}', function($request, $response, $args) {
	$templateName = $request->getAttribute('name');
	$htdoc = new DOMDocument();
	$htdoc->validateOnParse = true;
	$htdoc->loadHTMLFile("./html/${templateName}.html");

	// Special view-specific handling
	handleTemplateSpecifics($request, $response, $args, $templateName, $htdoc);

	// Return document to client
	echo $htdoc->saveHTML();
});

// Route for attempting to log in
$app->post('/login', function() {
	/* +++ TODO put in function call here, create standard request struc and
	 * methods to convert to JSON and back and whatnot, as in other site
	 */
});


$app->run();




?>
