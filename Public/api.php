<?php
/* api.php
 * Main server-side API for application, directs requests to proper
 * php function, also will handle authentication via Slim middleware
 * David Lenkner, c. 2016
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

$app = new \Slim\App;

// ...


$app->run();




?>
