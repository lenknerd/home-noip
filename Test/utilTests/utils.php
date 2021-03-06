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


/* Simple instance of above abstract class, specific data is string with
 * default empty string
 */
class JsonResponse_Str extends JsonResponse {
	// Some string data that may be provided with response
	public $specificString = "";

	// The required override... no assoc array needed here, just a simple var
	public function specificsAssocArray() {
		return $this->specificString;
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
		$conn = new PDO("mysql:host=$servername;dbname=$db_dbasname",
			$username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOException $e) {
		// On error, this returns success false
		$eMsg = new JsonResponse_Str( $e->getMessage() );
		$eMsg->respondAndExit();
	}

	return $conn;
}

?>
