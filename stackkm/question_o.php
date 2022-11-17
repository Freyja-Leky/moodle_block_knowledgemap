<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!--    <meta http-equiv="X-UA-Compatible" content="IE=edge">-->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--    <title>Knowledge Map</title>-->

    <!-- Bootstrap -->
    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css" >
    <!--    <link rel="stylesheet" href="dist/css/bootstrap.rtl.css">-->

    <!-- Bootstrap -->
    <script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- echarts -->
    <script type="module" src="lib/echarts.min.js"></script>
    <!-- Vis -->
    <script src="lib/vis.js"></script>
    <script src="lib/vis-network.min.js"></script>

    <script type="module" src="lib/jquery-3.6.1.js"></script>

</head>
<body>
<div class="container">
    <header class="d-flex align-items-center pb-3 mb-4 pt-5 border-bottom">
        <span class="fs-3 fw-bold" id="pageHeader"></span>
    </header>

    <ul class = "nav nav-tabs mx-3">
        <li class="nav-item">
            <a class="nav-link fw-light" href="#" id = "aCourse">Course</a>
        </li>
        <li class="nav-item">
            <a class="nav-link active fw-light " aria-current="page" href="#">Question</a>
        </li>
    </ul>

    <br />
    <br />

    <div class = "row">

        <br/>
        <br/>
        <br/>

        <div class="col-3" style="padding-bottom: 100%;height: 0">
            <h6>Quiz:</h6>
            <select class="form-select" id="quizSelect" onchange="changeQuiz()"></select>

            <p></p>
            <h6>Question:</h6>
            <select class="form-select" id="questionSelect"></select>
            <span class="badge bg-secondary">only STACK questions</span>

            <p></p>
            <h6>PRT:</h6>
            <select class="form-select" id="PRTSelect"></select>

            <p></p>
            <button class="btn btn-secondary" id="Refresh" style="width: 100%">Refresh</button>

        </div>

        <div class="col-4 offset-1" style="height: 600px">
            <div id = "chart" style="height: 0;width: 100%;padding-bottom: 100%;border:1px solid">
            </div>
        </div>

        <div class="col-3 offset-1" style="padding-bottom: 100%;height: 0">

            <br/>
            <br/>
            <br/>

            <div class="input-group">
                <select class="form-select"  id="addNodeSelect"></select>
                <button class="btn btn-secondary" id="addNode">Add</button>
            </div>

            <p></p>

            <div class="input-group">
                <select class="form-select" id="deleteNodeSelect"></select>
                <button class="btn btn-secondary" id="deleteNode">Delete</button>
            </div>

            <p></p>

            <div class="input-group">
                <span class="input-group-text">Set</span>
                <select class="form-select" id="setNodeSelect"></select>
                <span class="input-group-text">As</span>
                <select class="form-select" id="stateSelect">
                    <option value="Learnt">Learnt</option>
                    <option value="Failed">Failed</option>
                </select>
            </div>

            <p></p>

            <button class="btn btn-secondary" id="Save" style="width: 100%">Save All Changes</button>

        </div>

    </div>

</div>

<?php

    require ('../../config.php');
    require ($CFG->dirroot . '/mod/quiz/report/reportlib.php');
    require ($CFG->dirroot . '/mod/quiz/attemptlib.php');

    $id = required_param('id', PARAM_INT);
    $url = required_param('url',PARAM_RAW);


    //get Course id from DB
    if(!$course = $DB->get_record('course',array('id'=>$id))){
        print_error('invalidcourse');
    }

    //set shortName&
    $shortName = $course->shortname;
    $fullName = $course->fullname;

    //get quizList from DB
    if(!$quizList = $DB->get_records('quiz',array('course'=>$course->id))){
        print_error('invalidquiz');
    }

    //quiz
    //format quiz Id list & Name list for js, with same quiz in same position in both array
    $quizIdList = array();
    $quizNameList = array();

    foreach ($quizList as $key=>$value){
        $quizIdList[] = $value->id;
        $quizNameList[] = $value->name;
    }

    $js_quizIdList = json_encode($quizNameList);
    $js_quizNameList = json_encode($quizNameList);

    //question
    //format quiz2Question list and unique questionName list
    $questionIdList = array();
    $questionNameList = array();
    $quiz2QuestionList = array();

    for ($i = 0; $i < count($quizIdList); $i++){
        $q2QList = array();

        $quiz = quiz::create($quizIdList[$i]);
        $questions = quiz_report_get_significant_questions($quiz->get_quiz());

        foreach ($questions as $key=>$value){
            //get STACK question from DB
            if ($value->qtype == "stack"){
                if(!$question = $DB->get_record('question',array('id'=>$value->id))){
                    print_error('invalidquestion');
                }
                $q2QList[] = $question->id;

                //save unique question id&name
                $flag = true;
                for ($k = 0;$k < count($questionIdList);$k++){
                    if ($question->id==$questionIdList[$k]){
                        $flag = false;
                        break;
                    }
                }
                if ($flag){
                    $questionIdList[] = $question->id;
                    $questionNameList[] = $question->name;
                }
            }
        }
        $quiz2QuestionList[] = array("id"=>$quizIdList[$i],"questions"=>$q2QList);
    }

    $js_questionIdList = json_encode($questionIdList);
    $js_questionNameList = json_encode($questionNameList);
    $js_quiz2QuestionList = json_encode($quiz2QuestionList);

    //prt
    //
    $question2PRTList = array();

    for ($i = 0; $i < count($questionIdList); $i++){
        $q2PList = array();
        $prt = $DB->get_records('qtype_stack_prt_nodes',array("questionid"=>$questionIdList[$i]));

        foreach ($prt as $key=>$value){
            $q2PList[] = $value->trueanswernote;
            $q2PList[] = $value->falseanswernote;
        }

        $question2PRTList[] = array("id"=>$questionIdList[$i],"PRT"=>$q2PList);
    }

    $js_question2PRTList = json_encode($question2PRTList);

//
//    $PAGE->requires->jquery();
//    $PAGE->requires->js(new moodle_url($CFG->wwwroot . '/blocks/stackkm/js/test.js'));
//
//    $PAGE->requires->js_call_amd('js/test','init');
//    $PAGE->requires->js('/blocks/stackkm/js/test.js');

echo $OUTPUT->header();
echo $OUTPUT->footer();

?>

<script>

    //set Title
    let shortName = "<?php
        echo $shortName;
        ?>"
    document.title = shortName;

    //set PageHeader
    let fullName = "<?php
        echo $fullName;
        ?>"
    let pageHeader = document.getElementById("pageHeader");
    pageHeader.innerHTML = fullName;

    //set Course/Go back
    let url = "<?php
        echo $url;
        ?>"
    let aCourse = document.getElementById("aCourse");
    aCourse.href = url;

    let quizIdList = <?php
        echo $js_quizIdList;
        ?>

    var quizNameList = <?php
        echo $js_quizNameList;
        ?>

    var questionIdList = <?php
        echo $js_questionIdList;
    ?>

    var questionNameList = <?php
        echo $js_questionNameList;
    ?>

    var quiz2QuestionList = <?php
        echo $js_quiz2QuestionList;
    ?>

    var question2PRTList = <?php
        echo $js_question2PRTList
    ?>

        // function changeQuiz(){
        //     selectQuestion.options.length=0;
        //     let quiz = $(this).val();
        //
        // }


        //let save = document.getElementById("Save");
        //save.click(function () {
        //    let do = <?php
        //    echo $DB->get_record('question',array("id"=>2));
        //    ?>
        //});

</script>

<!--<script src="js/question.js"></script>-->

</body>
</html>