<?php

require('../../config.php');
require ($CFG->dirroot . '/mod/quiz/report/reportlib.php');
require ($CFG->dirroot . '/mod/quiz/attemptlib.php');

//select course=>id -> fullname
function getCourseFullName($id){
    global $DB;

    $course = $DB->get_record('course',array('id'=>$id));
    return $course->fullname;
}

//select course=>id -> shortname
function getCourseShortName($id){
    global $DB;

    $course = $DB->get_record('course',array('id'=>$id));
    return $course->shortname;
}

//select stackkm_km=>courseid -> id
function getMapId($id){
    global $DB;

    if (!$mapId = $DB->get_record('stackkm_km',array('courseid'=>$id))){
        return -1;
    }
    else
        return $mapId->id;
}

$query = $_GET["query"];

switch ($query){
    case "getCourseFullName":
        echo getCourseFullName($_GET["id"]);
        break;
    case "getCourseShortName":
        echo getCourseShortName($_GET["id"]);
        break;
    case "getMapId":
        echo getMapId($_GET["id"]);
        break;
}





?>
