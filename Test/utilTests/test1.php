<?php

require_once 'utils.php';

$testR = new JsonResponse_Str("Hello world!");
$testR->setSuccessful();

$testR->respondAndExit();

?>
