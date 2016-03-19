<?php
/* authentication.php
 * Functions for logging in, also for checking logged-in cookie on any
 * subsequent requests that should require authentication.
 * David Lenkner, c. 2016
 */

// Validate username and password against database, create session if valid
function validateAndCreateSession($unm, $pwd) {
	// Connect to database and declare a query
	$conn = getDatabaseConnection();

	// Prepare statement to check for users with that name
	$statement = $conn->prepare('SELECT hashedpw
		FROM users WHERE username = :username',
		array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
	// Execute
	$statement->execute(array(':username' => $unm));
	$wps = $statement->fetchAll();
	// Done with DB part here, disconnect
	$conn = null;

	// A response that will be used below... let default be no-good
	$rsp = new JsonResponse_Str("Invalid username or password.");

	// If no users available, send that err
	if( count($wps) == 0 ) {
		$rsp->respondAndExit();
	}

	// Get hashed password (could check that only one user exists, but okay)
	$phash = $wps[0][0];
	if( password_verify( $pwd, $phash ) ) {
		$rsp->setSuccessful();
		$rsp->specificString = $unm; // Put user name in specific string
		// If successful also create session
		createLogInSession($unm, $phash);
	}
	$rsp->respondAndExit();
}

// Set up a new session
function createLogInSession($uname, $phash) {
	session_start();
	$_SESSION["uname"] = $uname;
	$_SESSION["phash"] = $phash;
}

// Just return username
function getSessionUserName() {
	return $_SESSION["uname"];
}

// Kill log-in session
function endLogInSession() {
	// Remove all session variables
	session_unset();

	// Destroy the session
	session_destroy(); 
}

// Check the log-in session
function hasValidSession() {

	// See if username and password are set in session variables
	if( $_SESSION["uname"] == null || $_SESSION["phash"] == null ) {
		return false;
	}

	// Try connecting to database
	$conn = getDatabaseConnection();

	// Prepare statement to check for users with that name
	$statement = $conn->prepare('SELECT hashedpw
		FROM users WHERE username = :username',
		array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
	// Execute
	$statement->execute(array(':username' => $_SESSION["uname"]));
	$wps = $statement->fetchAll();

	// If no users available, can't be a valid session...
	if( count($wps) == 0 ) {
		return false;
	}

	// Get hashed password (could check that only one user exists, but okay)
	$phash = $wps[0][0];
	// If equal to session var then fine
	return ($phash == $_SESSION["phash"]);
}

?>
