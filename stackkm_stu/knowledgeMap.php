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

//select stackm_node_slot=>knowledgemap ->node ; stackkm_node =>node ->name,field
function getMapNodes($mapId){

    //with no mapId return -1
    if ($mapId == null || $mapId == -1){
        return -1;
    }

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
            //with no node then delete slot
            if(!$node = $DB->get_record('stackkm_node',array('id'=>$value->node))){
                $DB->delete_records('stackkm_node_slot',array('node'=>$value->node,'knowledgemap'=>$mapId));
                break;
            }
//            nodes{
//                "name": name,
//                "category": field,
//                "id": id
//            }
            $nodes[] = array("name"=>$node->name,"category"=>$node->field,"id"=>$node->id);
        }
    }

    return json_encode($nodes);
}

//select stackkm_link_slot=>knowledgemap -> link ; stackkm_link => link - > from, to
function getMapLinks($mapId){

    //with no mapId return -1
    if ($mapId == null || $mapId == -1){
        return -1;
    }

    global $DB;

    $links = array();

    if (!$link_slot = $DB->get_records('stackkm_link_slot',array('knowledgemap'=>$mapId))){
        return -1;
    }
    //get links from stackkm_node
    else{
        foreach ($link_slot as $key=>$value){
            //with no link then delete slot
            if (!$link = $DB->get_record('stackkm_link',array('id'=>$value->link))){
                $DB->delete_records('stackkm_link_slot',array('link'=>$value->link,'knowledgemap'=>$mapId));
                break;
            }
//            links{
//                "source": fromnode,
//                "target: tonode"
//            }
            $links[] = array("source"=>$link->fromnode,"target"=>$link->tonode);
        }
    }

    return json_encode($links);
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
    case "getMapNodes":
        echo getMapNodes($_GET["mapId"]);
        break;
    case "getMapLinks":
        echo getMapLinks($_GET["mapId"]);
        break;
}

?>
