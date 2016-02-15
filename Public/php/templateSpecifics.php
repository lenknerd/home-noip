<?php
/* templateSpecifics.php
 * For the templates used in views, main thing is just to grab and return html
 * which is done in main api Slim route.  But for some, special things have to
 * be done like modifying html, or restricting access based on credentials.
 * Those specifics are done here, switched by template name.
 * David Lenkner, c. 2016
 */



function handleTemplateSpecifics($req, $resp, $args, $tplName, &$htdoc) {

	switch($tplName) {
		case "navbarTemplate":
			// Get the home url but with https
			$selfAddr = $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
			$baseAddr = explode( '/api.php', $selfAddr )[0];
			$secureURL = 'https://' . $baseAddr;
			// Set the href on log in (https/http)
			$loginlink = $htdoc->getElementById("login");
			$loginlink->setAttribute("href", $secureURL);
			
			break;
	}

}


?>
