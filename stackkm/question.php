<?php

require('../../config.php');
require ($CFG->dirroot . '/mod/quiz/report/reportlib.php');
require ($CFG->dirroot . '/mod/quiz/attemptlib.php');

function getCourseFullName($id){
    global $DB;

    $course = $DB->get_record('course',array('id'=>$id));
    return $course->fullname;
}

function getCourseShortName($id){
    global $DB;

    $course = $DB->get_record('course',array('id'=>$id));
    return $course->shortname;
}

function getCourseQuizList($id){
    global $DB;

    if(!$quizList = $DB->get_records('quiz',array('course'=>$id))){
        print_error('invalidquiz');
        return "Null";
    }

    $jsQuizList = array();

    foreach($quizList as $key=>$value){
        $jsQuizList[] = array("id"=>$value->id,"name"=>$value->name);

    }

    return json_encode($jsQuizList);

}

function getQuizQuestionList($id)
{
    global $DB;

    $jsQuestionList = array();

    $quiz = quiz::create($id);
    $questions = quiz_report_get_significant_questions($quiz->get_quiz());

    foreach ($questions as $key => $value) {

        if ($value->qtype == "stack") {
            if (!$question = $DB->get_record('question', array('id' => $value->id))) {
                print_error('invalidquestion');
                break;
            }
            $jsQuestionList[] = array("id"=>$question->id,"name"=>$question->name);
        }
    }

    if (count($jsQuestionList)>0){
        return json_encode($jsQuestionList);
    }
    else{
        return "Null";
    }
}

function getQuestionPRTList($id){
    global $DB;

    $jsPRTList = array();

    if (!$prt = $DB->get_records('qtype_stack_prt_nodes',array("questionid"=>$id))){
        print_error('invalidprt');
        return "Null";
    }

    foreach ($prt as $key=>$value){
        $jsPRTList[] = $value->trueanswernote;
        $jsPRTList[] = $value->falseanswernote;
    }

    return json_encode($jsPRTList);
}

function getPRTNodes($question,$prt){
    global $DB;

    if (!$prtmap = $DB->get_record('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt))){
        return "Null";
    }
    //to do

    if (!$prt_slot = $DB->get_records('stackkm_prt_slot',array("prtmap"=>$prtmap->id))){
        $DB->delete_records('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt));
        return "Null";
    }

    $jsPRTNodes = array();

    foreach ($prt_slot as $key=>$value){
        if (!$node = $DB->get_record('stackkm_node',array('id'=>$value->node))){
            $DB->delete_records('stackkm_prt_slot',array("node"=>$value->node));
            break;
        }
        $jsPRTNodes[] = array("name"=>$node->name,"status"=>$value->status,"id"=>$value->node);
    }

    return json_encode($jsPRTNodes);
}

function insertPRTNode($question,$prt,$nodeId){
    global $DB;

    if (!$id = $DB->get_record('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt))){

        $map = new StdClass();
        $map->questionid = $question;
        $map->prtname = $prt;

        $id = $DB->insert_record('stackkm_prt_map',$map,true,false);
    }
    else{
        $id = $id->id;
    }

    if (!$slotId = $DB->get_record('stackkm_prt_slot',array("prtmap"=>$id,"node"=>$nodeId))){

        $prtSlot = new StdClass();
        $prtSlot->prtmap = $id;
        $prtSlot->node = $nodeId;
        $prtSlot->status = 1;

        return $DB->insert_record('stackkm_prt_slot',$prtSlot,true,false);
    }

    return -1;
}

function deletePRTNode($question,$prt,$nodeId){
    global $DB;

    if (!$prtmap = $DB->get_record('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt))){
        return -1;
    }
    $id = $prtmap->id;

    return $DB->delete_records('stackkm_prt_slot',array("prtmap"=>$id,"node"=>$nodeId));
}

function setStatus($question,$prt,$node,$status){
    global $DB;

    if (!$prtmap = $DB->get_record('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt))){
        return -1;
    }
    $prtmap = $prtmap->id;

    if (!$slot = $DB->get_record('stackkm_prt_slot',array("prtmap"=>$prtmap,"node"=>$node))){
        return -1;
    }
    $slotId = $slot->id;

    $newSlot = new StdClass();
    $newSlot->id = $slotId;
    $newSlot->prtmap = $prtmap;
    $newSlot->node = $node;
    $newSlot->status = $status;

    return $DB->update_record('stackkm_prt_slot',$newSlot,false);
}


$query = $_GET["query"];

switch ($query){
    case "fullname":
        echo getCourseFullName($_GET["id"]);
        break;
    case "shortname":
        echo getCourseShortName($_GET["id"]);
        break;
    case "quizlist":
        echo getCourseQuizList($_GET["id"]);
        break;
    case "questions":
        echo getQuizQuestionList($_GET["quiz"]);
        break;
    case "prt":
        echo getQuestionPRTList($_GET["question"]);
        break;
    case "prtnodes":
        echo getPRTNodes($_GET["question"],$_GET["prt"]);
        break;
    case "addnode" :
        echo insertPRTNode($_GET["question"],$_GET["prt"],$_GET["node"]);
        break;
    case "deletenode" :
        echo deletePRTNode($_GET["question"],$_GET["prt"],$_GET["node"]);
        break;
    case "setstatus" :
        echo setStatus($_GET["question"],$_GET["prt"],$_GET["node"],$_GET["status"]);
        break;
}

?>