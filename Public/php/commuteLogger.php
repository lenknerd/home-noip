<?php
/* commuteLogger.php
 * Functions and classes for logging waypoints, start/stopping trips, etc.
 * David Lenkner, c. 2016
 */

// Start a trip
function startTrippin() {
	// Placeholder...
	$rsp = new JsonResponse_Str("Problem starting trip.");

	// Find user's current ID (note, guaranteed logged in by route middleware)
	$usrn = getSessionUserName();

	// Connect to database
	$conn = getDatabaseConnection();

	// Prepare statement to check for users with that name
	$statement = $conn->prepare('SELECT id
		FROM users WHERE username = :username',
		array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
	// Execute
	$statement->execute(array(':username' => $usrn));
	$wps = $statement->fetchAll();

	// Check in case current user is not in db somehow
	if(count($wps) == 0) {
		$rsp->errMessage = "No users returned with uname!";
		$rsp->respondAndExit();
	}
	$uid = $wps[0][0];

	// Now create a new trip with that user id, empty notes for now
	$statement = $conn->prepare('INSERT INTO trips (user, notes)
		VALUES(:userid, :nonotes)');
	// Execute with given user id
	$statement->execute(array(':userid' => $uid, ':nonotes' => ''));

	// Grab the trip id created, store in session variable
	$trid = $conn->lastInsertId();
	$_SESSION["tripid"] = $trid;

	// Disconnect from db
	$conn = null;

	/* Send back trip id to user for diagnostic purposes, but never accept
	 * client's word on what his trip id is - use server-side _SESSION copy. */
	$rsp->specificString = $trid;
	$rsp->setSuccessful();
	$rsp->respondAndExit();
}

// Stop a trip
function stopTrippin() {
	$rsp = new JsonResponse_Basic("Problem stopping trip.");

	$_SESSION["tripid"] = null;

	$rsp->setSuccessful();
	$rsp->respondAndExit();
}

// Log a point
function logAPoint() {
	// Placeholder...
	$rsp = new JsonResponse_Basic("Logging a point went okay.");
	$rsp->setSuccessful();
	$rsp->respondAndExit();
}


?>
