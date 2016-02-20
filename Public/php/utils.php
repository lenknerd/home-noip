<?php
/* utils.php
 * This contains various utilities non-specific to the site, but useful.  For
 * example, utility to decode JSON a bit more easily with greater flexibility.
 * Also, class for standard JSON response with my error handling.
 * David Lenkner, c. 2016
 */

// A less stringent JSON decoder than PHP default, for output of JSON.stringify
function json_decode_custom($json, $assoc = FALSE) {
	$json = str_replace(array("\n","\r"),"",$json);
	$json = preg_replace('/([{,]+)(\s*)([^"]+?)\s*:/','$1"$3":',$json);
	return json_decode($json,$assoc);
}

/* Abstract class for response to a query, with success, err message, rest of
 * data will be specific to what purpose of request is */
abstract class JsonResponse {
	// The success is a boolean, default false need to specifically set true
	public $success = false;
	
	// The error message if any, to be filled in
	public $errMessage = "Unspecified error.";

	// Set no error
	public function setSuccessful() {
		$this->success = true;
		$this->errMessage = "";
	}

	// Each child needs to override this based on it's specific data
	abstract public function assocArray();

	// Gets JSON for public items to be returned, echoes it
	public function sendResponse() {
		$rsp = (object) ['success' => $this->success, 'errMessage' => $this->msg];
	}
}

?>
