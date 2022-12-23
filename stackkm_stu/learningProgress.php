<?php

require('../../config.php');
require ($CFG->dirroot . '/mod/quiz/report/reportlib.php');
require ($CFG->dirroot . '/mod/quiz/attemptlib.php');

//echo($USER->id);

$userId = $USER->id;

function getUserAttempt($courseId){
    global $DB,$userId;

    if(!$quizList = $DB->get_records('quiz',array('course'=>$courseId))){
        return -1;
    }

    $jsAttemptList = array();


    foreach ($quizList as $key=>$value){
        if (!$attempts = $DB->get_records('quiz_attempts',array('state'=>"finished",'quiz'=>$value->id,'userid'=>$userId))){
            continue;
        }

        usort($attempts,function ($a,$b){
            return $a->attempt < $b->attempt;
        });


        if (!$questionAttempts = $DB->get_records('question_attempts',array('questionusageid'=>$attempts[0]->uniqueid))){
            continue;
        }

        foreach ($questionAttempts as $qk=>$qv){
            $jsAttemptList[] = array("questionId"=>$qv->questionid,"summary"=>$qv->responsesummary);
        }

    }
    return json_encode($jsAttemptList);
}

function getPRTList(){
    global $DB;
    $data = json_decode($_POST['data']);

    if (count($data) < 1){
        return -1;
    }

    $jsPRTList = array();

    foreach ($data as $key=>$value){

        if (!$prtSlot = $DB->get_record('stackkm_prt_map',array("questionid"=>$value->questionId,"prtname"=>$value->prt))){
            continue;
        }

        if (!$nodes = $DB->get_records('stackkm_prt_slot',array("prtmap"=>$prtSlot->id))){
            continue;
            //to do
        }

        foreach ($nodes as $nk=>$nv){
            $jsPRTList[] = array("node"=>$nv->node,"status"=>$nv->status);
        }
    }

    return json_encode($jsPRTList);

}


$query = $_GET["query"];

switch ($query){
    case "getUserAttempt":
        echo getUserAttempt($_GET["id"]);
        break;
    case "getPRTList":
        echo getPRTList();
        break;
}

?>