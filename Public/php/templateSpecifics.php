<?php
/* templateSpecifics.php
 * For the templates used in views, main thing is just to grab and return html
 * which is done in main api Slim route.  But for some, special things have to
 * be done like modifying html, or restricting access based on credentials.
 * Those specifics are done here, switched by template name.
 * David Lenkner, c. 2016
 */

/* Various actions specific to particular templates or classes of templates
 * all of them load html somehow, but some may modify that after, some may
 * check session authentication before choosing what to load, etc.
 */
function handleTemplateSpecifics($req, $resp, $args, $tplName, &$htdoc) {

	/* If we're an internal-only template, will be inside /internal/ folder.
	 * List them here so can validate and look in there
	 */
	$internalPages = ["loggedInWelcome"];
	if( in_array($tplname, $internalPages) ) {
		if( hasValidSession() ) {
			$htdoc->loadHTMLFile("./html/internal/${templateName}.html");
		} else {
			// Read in the unauthorized access deal
			$htdoc->loadHTMLFile("./html/unauthorizedTemplate.html");
		}
	} else {
		// If not an internal page, no need to check session
		$htdoc->loadHTMLFile("./html/${templateName}.html");
	}

	// A few details specific to individual views
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
