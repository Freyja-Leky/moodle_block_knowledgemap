<?php
use core\report_helper;
require('../../config.php');

$id = required_param('id', PARAM_INT);

$url = new moodle_url('/blocks/devesample/report.php',array('id'=>$id));

$PAGE->set_url($url);
$PAGE->set_pagelayout('admin');

//echo $OUTPUT->header();
echo $id;
//echo $OUTPUT->footer();
