<?php

require_once '../../Public/php/authentication.php';
require_once '../../Public/php/utils.php';

echo "Trying a login...\n";

# Works here with my uname as gmail and pw as golike with no bd and no caps
validateAndCreateSession("", "");

# Of course, cookie think is bit tricky, doesn't quite work on cmdline
?>
