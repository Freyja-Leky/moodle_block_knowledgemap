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
            $nodes[] = array("name"=>$node->name,"category"=>$node->field,"id"=>$node->id);
        }
    }
    
    return json_encode($nodes);
}

//select stackkm_link_slot=>knowledgemap -> link ; stackkm_link => link - > from, to
function getMapLinks($mapId){
    global $DB;

    $links = array();

    if (!$link_slot = $DB->get_records('stackkm_link_slot',array('knowledgemap'=>$mapId))){
        return -1;
    }
    //get links from stackkm_node
    else{
        foreach ($link_slot as $key=>$value){
            if (!$link = $DB->get_record('stackkm_link',array('id'=>$value->link))){
                $DB->delete_records('stackkm_link_slot',array('link'=>$value->link));
                break;
            }
            $links[] = array("source"=>$link->fromnode,"target"=>$link->tonode);
        }
    }

    return json_encode($links);
}

// insert stackkm_node & stackkm_node_slot
function insertOneNode($name,$field,$mapId){
    global $DB;

    if (!$id = $DB->record_exists('stackkm_node',array('name'=>$name,'field'=>$field))){

        $node = new StdClass();
        $node->name = $name;
        $node->field = $field;

        $id = $DB->insert_record('stackkm_node',$node,true,false);
    }
    
    if (!$slotId = $DB->record_exists('stackkm_node_slot',array('knowledgemap'=>$mapId,'node'=>$id))){

        $nodeSlot = new StdClass();
        $nodeSlot->knowledgemap = $mapId;
        $nodeSlot->node = $id;

        return $DB->insert_record('stackkm_node_slot',$nodeSlot,true,false);
    }
    return -1;
}

// insert stackkm_km
function insertMap($courseid){
    global $DB;

    $km = new StdClass();
    $km->courseid = $courseid;

    return $DB->insert_record('stackkm_km',$km,true,false);
}

//delete stackkm_km
function deleteMap($courseid){
    global $DB;

    return $DB->delete_records('stackkm_km',array('courseid'=>$courseid));
}

//with insertMap and insertOneNode
function insertFirstNode($name,$field,$id){
    global $DB;

    echo "insertFirstNode";
    
    if (!$mapId = $DB->get_record('stackkm_km',array('courseid'=>$id))){
        $km = new StdClass();
        $km->courseid = $id;

        $mapId = $DB->insert_record('stackkm_km',$km,true,false);
        echo $mapId;
    }

    return insertOneNode($name,$field,$mapId);
}

//insert stackkm_link & stackkm_link_slot
function insertLink($to,$from,$mapId){
    global $DB;

    if (!$id = $DB->record_exists('stackkm_link',array('tonode'=>$to,'fromnode'=>$from))){

        $link = new StdClass();
        $link->tonode = $to;
        $link->fromnode = $from;

        $id = $DB->insert_record('stackkm_link',$link,true,false);
    }
    else{
        $id = $id->id;
    }

    if (!$slotId = $DB->record_exists('stackkm_link_slot',array('knowledgemap'=>$mapId,'link'=>$id))){

        $linkSlot = new StdClass();
        $linkSlot->knowledgemap = $mapId;
        $linkSlot->link = $id;

        return $DB->insert_record('stackkm_link_slot',$linkSlot,true,false);
    }
    return -1;
}

function updateMapNodes($mapId){
    global $DB;

    $data = json_decode($_POST['nodes']);

    $DB->delete_records('stackkm_node_slot',array("knowledgemap"=>$mapId));

    $nodes = [];

    foreach ($data as $key=>$value){
        $nodeId = null;
        $slotId = null;
        if (!$nodeId = $DB->get_record('stackkm_node',array("name"=>$value->name,"field"=>$value->category))){
            $node = new StdClass();
            $node->name = $value->name;
            $node->field = $value->category;

            $nodeId = $DB->insert_record('stackkm_node',$node,true,false);
        }
        else{
            $nodeId = $nodeId->id;
        }

        if (!$slotId = $DB->get_record('stackkm_node_slot',array("knowledgemap"=>$mapId,"node"=>$nodeId))){
            $nodeSlot = new StdClass();
            $nodeSlot->knowledgemap = $mapId;
            $nodeSlot->node = $nodeId;

            $slotId = $DB->insert_record('stackkm_node_slot',$nodeSlot,true,false);
        }
//        print_r($value->name);
    }

    return -1;
}

function updateMapLinks($mapId){
    global $DB;

    $data = json_decode($_POST['links']);

    $links = array();
    $nodes = array();

    $mapSlot = $DB->get_records('stackkm_node_slot',array("knowledgemap"=>$mapId));

    foreach($mapSlot as $key=>$value){
        $node = $DB->get_record('stackkm_node',array("id"=>$value->node));
        $nodes[] = array("name"=>$node->name,"id"=>$node->id);
    }

    foreach ($data as $key=>$value){
        $source = null;
        $target = null;

        foreach ($nodes as $node=>$nv){

            if ($value->Source == $nv["name"]){
                $source = $nv["id"];
                break;
            }
        }
        foreach ($nodes as $node=>$nv){
            if ($value->Target == $nv["name"]){
                $target = $nv["id"];
                break;
            }
        }

        if ($source == null || $target == null){
            print_r("no");
            continue;
        }

        $links[] = array("source"=>$source,"target"=>$target);
    }

    $DB->delete_records('stackkm_link_slot',array("knowledgemap"=>$mapId));


    foreach ($links as $key=>$value){

        $linkId = null;
        $slotId = null;

        if (!$linkId = $DB->get_record('stackkm_link',array("fromnode"=>$value["source"],"tonode"=>$value["target"]))){
            $link = new StdClass();
            $link->fromnode =$value["source"];
            $link->tonode = $value["target"];

            $linkId = $DB->insert_record('stackkm_link',$link,true,false);
        }
        else{
            $linkId = $linkId->id;
        }

        if (!$slotId = $DB->get_record('stackkm_link_slot',array("knowledgemap"=>$mapId,"link"=>$linkId))){
            $linkSlot = new StdClass();
            $linkSlot->knowledgemap = $mapId;
            $linkSlot->link = $linkId;

            $slotId = $DB->insert_record('stackkm_link_slot',$linkSlot,true,false);
        }
    }
    return -1;
}

function test($to,$from){
    global $DB;

//    echo $to,$from;

    return $DB->get_record('stackkm_link',array('to'=>$to,'from'=>$from));
   
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
    case "deleteMap":
        echo deleteMap($_GET["id"]);
        break;
    case "mapNodes":
        echo getMapNodes($_GET["mapId"]);
        break;
    case "mapLinks":
        echo getMapLinks($_GET["mapId"]);
        break;
    case "insertOneNode":
        echo insertOneNode($_GET["name"],$_GET["field"],$_GET["mapId"]);
        break;
    case "insertFirstNode":
        echo insertFirstNode($_GET["name"],$_GET["field"],$_GET["id"]);
        break; 
    case "insertLink":
        echo insertLink($_GET["to"],$_GET["from"],$_GET["mapId"]);
        break;
    case "filenodes":
        echo updateMapNodes($_GET["mapId"]);
        break;
    case "filelinks":
        echo updateMapLinks($_GET["mapId"]);
        break;
    case "test":
        echo test($_GET["to"],$_GET["from"]);
        break;
}


?>
