
//---------------------------UI---------------------------
//echarts div
let chart = echarts.init(document.getElementById('chart'));
window.onresize = function() {
    chart.resize();
};

let selectQuiz = $("#quizSelect");
let pScore = $("#score");
let pTimestamp = $("#timestamp");
let selectQuestion = $("#questionSelect");
let pAnswer = $("#answer");

//---------------------------Data---------------------------
//courseId & return url
let id = null;
let url = null;

let attempt = null;

let option = null;

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}



//---------------------------UI function---------------------------

selectQuiz.change(function () {
    //clear options
    selectQuestion.find("option").remove();
    pAnswer.text("");


    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuestion.append(opt);

    let quiz = $(this).val();
    if (quiz == -1){
        return;
    }

    $.ajax({
        url:"testFeedback.php?query="+"getQuizAttempt"+"&quiz="+quiz,
        async: false,
        success:function (data,status) {
                if (data == -1){
                    attempt = -1;
                    pScore.text("No record");
                    pTimestamp.text("????-??-?? ??:??:??");
                }
                else {
                    attempt = JSON.parse(data);
                    pScore.text(attempt.score+" / "+attempt.fullMark);
                    pTimestamp.text(attempt.time);
                }
        }
    })

    if (attempt == -1){
        console.log(attempt);
        return;
    }

    //set question select
    $.ajax({
        url:"testFeedback.php?query="+"getQuizQuestionList"+"&quiz="+quiz,
        async:false,
        success:function (data,status) {
            if (data != -1) {
                questionList = JSON.parse(data);
                for (let i = 0; i < questionList.length; i++) {
                    let opt = "<option value=" + questionList[i].id + ">" + questionList[i].name + "</option>";
                    selectQuestion.append(opt);
                }
            }
        }
    })

    selectQuestion[0].selectedIndex = -1;
})

selectQuestion.change(function () {
    let question = $(this).val();
    let record = null;

    $.ajax({
        url:"testFeedback.php?query="+"getQuestionAttempt"+"&attempt="+attempt.attemptId+"&question="+question,
        async:false,
        success:function (data,status) {
            if (data != -1) {
                    record = data;
                }
        }
    })

    let scorePattern = new RegExp("score");
    if (!scorePattern.test(record)){

        pAnswer.text("Valid record");
        return;
    }

    let seed = record.split(/[:,;,\[,\],|]/);
    pAnswer.text(seed[3]);

    let prt = seed[seed.length-1].trim();

    let prtNodes = null;

    $.ajax({
        url:"testFeedback.php?query="+"getPRTNodes"+"&question="+question+"&prt="+prt,
        async:false,
        success:function (data,status) {
            if (data != -1) {
                prtNodes = JSON.parse(data);
            }
        }
    })

    chart.clear();

    window.onresize = function() {
        chart.resize();
    };

    option = drawPRTMap(prtNodes);
    if (option == null){
        return;
    }
    chart.setOption(option);


})

function init() {

    //get courseId & return url from url
    id = getQueryVariable("id");
    url = getQueryVariable("url");

    url = url+"="+id;

    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;

    let knowledgeMapUrl = "knowledgeMap.html?id="+id+"&url="+url;
    let aknowledgeMap = document.getElementById('aKnowledgeMap');
    aknowledgeMap.href = knowledgeMapUrl;

    let learningProgressUrl = "learningProgress.html?id="+id+"&url="+url;
    let alearningProgress = document.getElementById('aLearningProgress');
    alearningProgress.href = learningProgressUrl;

    //set Title
    let fullName = null;
    let shortName = null;

    $.ajax({
        url:"knowledgeMap.php?query="+"getCourseFullName"+"&id="+id,
        success:function (data,status) {
            fullName = data;
            let pageHeader = document.getElementById("pageHeader");
            pageHeader.innerHTML = fullName;
        }
    })

    $.ajax({
        url:"knowledgeMap.php?query="+"getCourseShortName"+"&id="+id,
        success:function (data,status) {
            shortName = data;
            document.title = shortName;
        }
    })

    //set Quiz options
    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuiz.append(opt);

    $.ajax({
        url:"testFeedback.php?query="+"getCourseQuizList"+"&id="+id,
        success:function (data,status) {
            if (data != -1){
                quizList = JSON.parse(data);
                for (let i = 0;i<quizList.length;i++){
                    opt = "<option value="+quizList[i].id+">"+quizList[i].name+"</option>"
                    selectQuiz.append(opt);
                }
            }
        }
    })
}

init();