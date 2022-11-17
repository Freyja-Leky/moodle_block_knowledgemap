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

    if (!$nodes = $DB->get_record('stackkm_prt_map',array("questionid"=>$question,"prtname"=>$prt))){
        return "Null";
    }
    else
        return json_encode($nodes);
    //to do

//    $jsPRTNodes = array();
//
//    $jsPRTNodes[]=$question;
//    $jsPRTNodes[]=$prt;

//    if (!$id = $DB->get_record('block_devesample_nodes',array("id"=>"1111"))){
////        print_error('invalidmap');
//        return "Null";
//    }
//
//    if (!$nodes = $DB->get_records('block_devesample_prt_mapslot',array("prtmap"=>$id->id))){
//        print_error('invalidnodes');
//        return "Null";
//    }
//
//    foreach ($nodes as $key=>$value){
//        $jsPRTNodes[] = array("node"=>$value->node,"status"=>$value->status);
//    }
//
//    if (count($jsPRTNodes)<=0){
//        return "Null";
//    }

//    return json_encode($jsPRTNodes);
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
}

?>