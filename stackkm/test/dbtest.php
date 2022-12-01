<?php

$t = $_GET['query'];

print_r($t);

$data = $_POST['node'];
$data = json_decode($data);

print_r($data);
?>
