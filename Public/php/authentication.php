<?php
/* authentication.php
 * Functions for logging in, also for checking logged-in cookie on any
 * subsequent requests that should require authentication.
 * David Lenkner, c. 2016
 */

function validate($unm, $pwd) {
	// Connect to database and declare a query
	$conn = getDatabaseConnection();

	// Prepare statement to check for users with that name
	$statement = $conn->prepare('SELECT hashedpw
		FROM users WHERE username = :username',
		array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
	// Execute
	$statement->execute(array(':username' => $unm));
	$wps = $statement->fetchAll();

	// A response that will be used below... let default be no-good
	$rsp = JsonResponse_Str("Invalid username or password.");

	// If no users available, send that err
	if( count($wps) == 0 ) {
		$rsp->respondAndExit();
	}

	// Get hashed password (could check that only one user exists, but okay)
	$phash = $wps[0][0];
	if( password_verify( $pwd, $phash ) ) {
		$rsp->setSuccessful();
		// If successful also create cred cookie
		$cky = new CredCookie($unm, $phash);
	}
	$rsp->respondAndExit();
}

class CredCookie {
	public $uname = "";
	public $phash = "";

	// What the cookie will be stored as on client
	public static $cookiename = "homesite-credcookie";

	// How long it should be stored for
	public static $expSecs = 86400; // 1 day 

	// Initiate from username and password hash (doesn't make cookie, just obj)
	public function __construct($u, $ph) {
		$this->uname = $u;
		$this->phash = $ph
	}

	// Store on client side
	public function saveToClient() {
		// Make it the username appended onto the hash (60 chars, easy demarc)
		$concatval = $this->phash . $this->uname;
		setcookie( $this->cookiename,
			$concatval,
			$this->expSecs,
			'/',
			$_SERVER['HTTP_HOST'],
			true ); // true for secure... ensure only happens over https
	}

}

?>
