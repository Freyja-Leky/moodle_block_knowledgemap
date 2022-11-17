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

//select stackm_node_slot=>knowledgemap ->node ; stackkm_node_=>node ->name,field
function getMapNodes($mapId){
    global $DB;

    $nodes = array();

    //with no data in slot and clear the km record
    if (!$node_slot = $DB->get_records('stackkm_node_slot',array('knowledgemap'=>$mapId))){
        $DB->delete_records('stackkm_km',array('id'=>$mapId));
        return -1;
    }
    //get node from stackkm_node
    else{
        foreach ($node_slot as $key=>$value){
            if(!$node = $DB->get_record('stackkm_node',array('id'=>$value->node))){
                $DB->delete_records('stackkm_node_slot',array('node'=>$value->node));
                break;
            }
            $nodes[] = array("name"=>$node->name,"category"=>$node->field);
        }
    }
    
    return $nodes;
}

function insertMap($courseid){
    global $DB;

    $km = new StdClass();
    $km->courseid = $courseid;

    return $DB->insert_record('stackkm_km',$km,true,false);
}

$query = $_GET["query"];

switch ($query){
    case "fullname":
        echo getCourseFullName($_GET["id"]);
        break;
    case "shortname":
        echo getCourseShortName($_GET["id"]);
        break;
    case "mapId":
        echo getMapId($_GET["id"]);
        break;
    case "insertMap":
        echo insertMap($_GET["id"]);
        break;
    case "mapNodes":
        echo getMapNodes($_GET["mapId"]);
        break;
}


?>
