<?php

function handleTemplateSpecifics($req, $resp, $args, $tplName) {

	switch($tplName) {
		case "navbarTemplate":
			// Get the home url but with https
			$selfAddr = $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
			$baseAddr = explode( '/php/', $selfAddr )[0];
			$secureURL = 'https://' . $baseAddr;
			// Set the href on log in (https/http) ++ 
			
			break;
	}


?>
