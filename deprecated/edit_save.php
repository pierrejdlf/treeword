<?php
	$current = $_POST['content'];
	// only for local php (which is protecting slashes !)
	//$current = stripslashes($current);
	file_put_contents("samples/".$_POST['fn'], $current);
?>