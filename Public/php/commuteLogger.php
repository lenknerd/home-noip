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
	// Start off point index at zero
	$_SESSION["triporderindex"] = 0;

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
	$_SESSION["tripid"] = null;
	$_SESSION["triporderindex"] = null;
	$rsp = new JsonResponse_Basic("");
	$rsp->setSuccessful();
	$rsp->respondAndExit();
}

// Log a point with given time, latitude, longitude
function logAPoint($pTime, $pLat, $pLong) {
	$rsp = new JsonResponse_Basic("Problem logging point.");

	// Connect to database
	$conn = getDatabaseConnection();

	// Now create a new trip with that user id, empty notes for now
	$statement = $conn->prepare('INSERT INTO waypoints
		(trip, time, triporderindex, latitude, longitude)
		VALUES(:trid, :t, :ord, :lat, :long)');
	// Execute with given user id
	$statement->execute(array(':trid' => $_SESSION["tripid"],
		':t' => $pTime,
		':ord' => $_SESSION["triporderindex"],
		':lat' => $pLat,
		':long' => $pLong) );

	// Disconnect from db
	$conn = null;

	// Increment which point you're on, be done
	$_SESSION["triporderindex"] += 1;
	$rsp->setSuccessful();
	$rsp->respondAndExit();
}


?>
