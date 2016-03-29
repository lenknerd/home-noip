<?php
/* commuteLogger.php
 * Functions and classes for logging waypoints, start/stopping trips, etc.
 * David Lenkner, c. 2016
 */

// Start a trip
function startTrippin() {
	// Placeholder...
	$rsp = new JsonResponse_Basic("startTrippin went okay.");
	$rsp->setSuccessful();
	$rsp->respondAndExit();
}

// Stop a trip
function stopTrippin() {
	// Placeholder...
	$rsp = new JsonResponse_Basic("stopTrippin went okay.");
	$rsp->setSuccessful();
	$rsp->respondAndExit();
}


?>
