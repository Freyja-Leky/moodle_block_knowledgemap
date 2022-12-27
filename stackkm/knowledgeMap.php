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

//input file nodes
function updateMapNodes($mapId, $id){
    global $DB;

    $data = json_decode($_POST['nodes']);

    //with no data clear km
    if (count($data) < 1){
        $DB->delete_records('stackkm_node_slot',array("knowledgemap"=>$mapId));
        $DB->delete_records('stackkm_km',array('courseid'=>$id,'id'=>$mapId));
        return -1;
    }

    //create km
    if ($mapId == -1){
        $km = new StdClass();
        $km->courseid = $id;
        $mapId = $DB->insert_record('stackkm_km',$km,true,false);
    }

    $DB->delete_records('stackkm_node_slot',array("knowledgemap"=>$mapId));

    foreach ($data as $key=>$value){
        $nodeId = null;
        if (!$nodeId = $DB->get_record('stackkm_node',array("name"=>$value->name,"field"=>$value->category))){
            $node = new StdClass();
            $node->name = $value->name;
            $node->field = $value->category;
            $nodeId = $DB->insert_record('stackkm_node',$node,true,false);
        }
        else{
            $nodeId = $nodeId->id;
        }

        if (!$slot = $DB->record_exists('stackkm_node_slot',array("knowledgemap"=>$mapId,"node"=>$nodeId))){
            $nodeSlot = new StdClass();
            $nodeSlot->knowledgemap = $mapId;
            $nodeSlot->node = $nodeId;
            $slot = $DB->insert_record('stackkm_node_slot',$nodeSlot,true,false);
        }
    }

    return "update nodes succeed";
}

//input file links
function updateMapLinks($mapId){
    global $DB;

    $data = json_decode($_POST['links']);

    //with no data
    if (count($data) < 1){
        $DB->delete_records('stackkm_link_slot',array("knowledgemap"=>$mapId));
        return -1;
    }

    //with no map
    if ($mapId == -1){
        return "no map exists";
    }

    //get map nodes
    $nodes = array();
    $mapSlot = $DB->get_records('stackkm_node_slot',array("knowledgemap"=>$mapId));
    foreach($mapSlot as $key=>$value){
        $node = $DB->get_record('stackkm_node',array("id"=>$value->node));
        $nodes[] = array("name"=>$node->name,"id"=>$node->id);
    }

    //construct map links with node id
    $links = array();
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
            print_r("no node");
            continue;
        }

        $links[] = array("source"=>$source,"target"=>$target);
    }

    $DB->delete_records('stackkm_link_slot',array("knowledgemap"=>$mapId));

    foreach ($links as $key=>$value){

        $linkId = null;
        if (!$linkId = $DB->get_record('stackkm_link',array("fromnode"=>$value["source"],"tonode"=>$value["target"]))){
            $link = new StdClass();
            $link->fromnode =$value["source"];
            $link->tonode = $value["target"];
            $linkId = $DB->insert_record('stackkm_link',$link,true,false);
        }
        else{
            $linkId = $linkId->id;
        }

        if (!$slot = $DB->record_exists('stackkm_link_slot',array("knowledgemap"=>$mapId,"link"=>$linkId))){
            $linkSlot = new StdClass();
            $linkSlot->knowledgemap = $mapId;
            $linkSlot->link = $linkId;
            $slot = $DB->insert_record('stackkm_link_slot',$linkSlot,true,false);
        }
    }
    return "update links succeed";
}

// insert stackkm_km
function insertMap($id){
    global $DB;

    $km = new StdClass();
    $km->courseid = $id;

    return $DB->insert_record('stackkm_km',$km,true,false);
}

// insert stackkm_node & stackkm_node_slot
function insertNode($name,$field,$mapId){
    global $DB;

    if ($mapId == -1){
        return  -2;
    }

    if (!$nodeId = $DB->get_record('stackkm_node',array('name'=>$name,'field'=>$field))){
        $node = new StdClass();
        $node->name = $name;
        $node->field = $field;
        $nodeId = $DB->insert_record('stackkm_node',$node,true,false);
    }
    else{
        $nodeId = $nodeId->id;
    }
    
    if (!$slot = $DB->record_exists('stackkm_node_slot',array('knowledgemap'=>$mapId,'node'=>$nodeId))){
        $nodeSlot = new StdClass();
        $nodeSlot->knowledgemap = $mapId;
        $nodeSlot->node = $nodeId;
        return $DB->insert_record('stackkm_node_slot',$nodeSlot,true,false);
    }
    return -1;
}


//insert stackkm_link & stackkm_link_slot
function insertLink($to,$from,$mapId){
    global $DB;

    if ($mapId == -1){
        return -2;
    }

    if (!$linkId = $DB->get_record('stackkm_link',array('tonode'=>$to,'fromnode'=>$from))){
        $link = new StdClass();
        $link->tonode = $to;
        $link->fromnode = $from;
        $linkId = $DB->insert_record('stackkm_link',$link,true,false);
    }
    else{
        $linkId = $linkId->id;
    }

    if (!$slot = $DB->record_exists('stackkm_link_slot',array('knowledgemap'=>$mapId,'link'=>$linkId))){
        $linkSlot = new StdClass();
        $linkSlot->knowledgemap = $mapId;
        $linkSlot->link = $linkId;
        return $DB->insert_record('stackkm_link_slot',$linkSlot,true,false);
    }
    return -1;
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
    case "updateMapNodes":
        echo updateMapNodes($_GET["mapId"],$_GET["id"]);
        break;
    case "updateMapLinks":
        echo updateMapLinks($_GET["mapId"]);
        break;
    case "insertMap":
        echo insertMap($_GET["id"]);
        break;
    case "insertNode":
        echo insertNode($_GET["name"],$_GET["field"],$_GET["mapId"]);
        break;
    case "insertLink":
        echo insertLink($_GET["to"],$_GET["from"],$_GET["mapId"]);
        break;
}


?>
