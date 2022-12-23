<?php

require('../../config.php');
require ($CFG->dirroot . '/mod/quiz/report/reportlib.php');
require ($CFG->dirroot . '/mod/quiz/attemptlib.php');

//echo($USER->id);

$userId = $USER->id;

// select quiz:id & name with courseId
function getCourseQuizList($id){
    global $DB;

    if(!$quizList = $DB->get_records('quiz',array('course'=>$id))){
        return -1;
    }

    $jsQuizList = array();

    foreach($quizList as $key=>$value){
        $jsQuizList[] = array("id"=>$value->id,"name"=>$value->name);

    }

    return json_encode($jsQuizList);

}

function getQuizAttempt($quizId){
    global $DB,$userId;

    if (!$attemptList = $DB->get_records('quiz_attempts',array('state'=>"finished",'quiz'=>$quizId,'userid'=>$userId))){
        return -1;
    }

    usort($attemptList,function ($a,$b){
       return $a->attempt < $b->attempt;
    });

    $quiz = $DB->get_record('quiz',array('id'=>$quizId));

    $time = date('Y-m-d H:i:s',$attemptList[0]->timefinish);
    $lastAttempt = array("attemptId"=>$attemptList[0]->uniqueid,"score"=>$attemptList[0]->sumgrades,"time"=>$time,"fullMark"=>$quiz->sumgrades);

    return json_encode($lastAttempt);
}

//select question: id & name with courseId
function getQuizQuestionList($id)
{
    global $DB;

    $jsQuestionList = array();

    $quiz = quiz::create($id);
    $questions = quiz_report_get_significant_questions($quiz->get_quiz());

    foreach ($questions as $key => $value) {
        if ($value->qtype == "stack") {
            if (!$question = $DB->get_record('question', array('id' => $value->id))) {
                break;
            }
            $jsQuestionList[] = array("id"=>$question->id,"name"=>$question->name);
        }
    }

    if (count($jsQuestionList) > 0){
        return json_encode($jsQuestionList);
    }
    else
        return -1;
}

function getQuestionAttempt($attemptId,$questionId){
    global $DB;

    if (!$questionAttempt = $DB->get_record('question_attempts',array('questionusageid'=>$attemptId,'questionid'=>$questionId))){
        return -1;
    }

    return $questionAttempt->responsesummary;
}

function getPRTNodes($question,$prt){
    global $DB;

    if (!$prtMap = $DB->get_record('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt))){
        return -1;
    }

    if (!$prtSlot = $DB->get_records('stackkm_prt_slot',array("prtmap"=>$prtMap->id))){
        $DB->delete_records('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt));
        return -1;
    }

    $jsPRTNodes = array();

    foreach ($prtSlot as $key=>$value){
        if (!$node = $DB->get_record('stackkm_node',array('id'=>$value->node))){
            $DB->delete_records('stackkm_prt_slot',array("node"=>$value->node,"prtmap"=>$prtMap->id));
            continue;
        }
        $jsPRTNodes[] = array("name"=>$node->name,"status"=>$value->status,"id"=>$value->node);
    }

    if (count($jsPRTNodes) > 0){
        return json_encode($jsPRTNodes);
    }
    else
        return -1;
}

$query = $_GET["query"];

switch ($query){
    case "getCourseQuizList":
        echo getCourseQuizList($_GET["id"]);
        break;
    case "getQuizQuestionList":
        echo getQuizQuestionList($_GET["quiz"]);
        break;
    case "getQuizAttempt":
        echo getQuizAttempt($_GET["quiz"]);
        break;
    case "getQuestionAttempt":
        echo getQuestionAttempt($_GET["attempt"],$_GET["question"]);
        break;
    case "getPRTNodes":
        echo getPRTNodes($_GET["question"],$_GET["prt"]);
        break;
}

?>
