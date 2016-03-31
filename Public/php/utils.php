<?php
/* utils.php
 * This contains various utilities non-specific to site content, used many
 * places.  For example, utility to decode JSON more easily from JS side.
 * Also, class for standard JSON response with my error handling.  Function
 * to get database connection.
 * David Lenkner, c. 2016
 */

// A less stringent JSON decoder than PHP default, for output of JSON.stringify
function json_decode_custom($json, $assoc = FALSE) {
	$json = str_replace(array("\n","\r"),"",$json);
	$json = preg_replace('/([{,]+)(\s*)([^"]+?)\s*:/','$1"$3":',$json);
	return json_decode($json,$assoc);
}

/* Abstract class for response to a query, with success, err message, rest of
 * data will be specific to what purpose of request is
 */
abstract class JsonResponse {
	// The success is a boolean, default false need to specifically set true
	public $success = false;
	
	// The error message if any, to be filled in
	public $errMessage = "Unspecified error.";

	// Constructor default for an error message, just provide msg string
	public function __construct($emsg) {
		$this->errMessage = $emsg;
	}

	// Set no error
	public function setSuccessful() {
		$this->success = true;
		$this->errMessage = "";
	}

	// Each child needs to override this based on it's specific data
	abstract public function specificsAssocArray();

	// Gets JSON for public items to be returned, echoes it, stops
	public function respondAndExit() {
		$rsp = (object) ['success' => $this->success,
			'errMessage' => $this->errMessage,
			'specifics' => $this->specificsAssocArray()
		];
		echo json_encode( $rsp );
		exit();
	}
}


// Simplest instance of above abstract class, no members except base stuff
class JsonResponse_Basic extends JsonResponse {
	// The required override... no assoc array needed here, just a simple var
	public function specificsAssocArray() {
		return [];
	}
}


/* Next simplest instance of above abstract class, specific data is string
 * with default empty string
 */
class JsonResponse_Str extends JsonResponse {
	// Some string data that may be provided with response
	public $specificString = "";

	// The required override... no assoc array needed here, just a simple var
	public function specificsAssocArray() {
		return $this->specificString;
	}

}

/* Special response containing trip info.  Three strings, each a space-sep'd
 * array, one for times, one for latitudes, one for longitudes. */
class JsonResponse_TripInfo extends JsonResponse {
	public $times = "";
	public $lats = "";
	public $longs = "";

	// The required override...
	public function specificsAssocArray() {
		return (object) ['spaceSepTimes' => $this->times,
			'spaceSepLats' => $this->lats,
			'spaceSepLongs' => $this->longs
		];
	}
}

// Get database connection
function getDatabaseConnection() {
	$db_srvrname = "localhost";
	$db_username = "noipsite";
	$db_password = "noipsite";
	$db_dbasname = "homesite";

	// Create connection
	$conn = null;
	try {
		$conn = new PDO("mysql:host=$db_srvrname;dbname=$db_dbasname",
			$db_username, $db_password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOException $e) {
		// On error, this returns success false
		$eMsgStr = "Getting connection to DB, error: " . $e->getMessage();
		$eMsg = new JsonResponse_Str( $eMsgStr );
		$eMsg->respondAndExit();
	}

	if($conn === FALSE) {
		$eMsg = new JsonResponse_Str( "Database connect crash and burn!" );
		$eMsg->respondAndExit();
	}

	return $conn;
}

?>
