
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


//---------------------------UI function---------------------------

selectQuiz.change(function () {
    //clear
    chart.clear();
    selectQuestion.find("option").remove();
    pAnswer.text("No record");

    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuestion.append(opt);

    let quiz = $(this).val();
    if (quiz == -1){
        return;
    }

    //get attempt
    attempt = getQuizAttempt(quiz);

    if (attempt == null){
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

    // selectQuestion[0].selectedIndex = -1;
})

selectQuestion.change(function () {

    chart.clear();

    let question = $(this).val();
    let record = getQuestionAttempt(attempt.attemptId,question);

    if (record == null){
        return;
    }

    //process data into prt node
    let scorePattern = new RegExp("score");
    if (!scorePattern.test(record)){
        pAnswer.text("Valid record");
        return;
    }
    let seed = record.split(/[:,;,\[,\],|]/);
    pAnswer.text(seed[3]);
    let prt = seed[seed.length-1].trim();

    let prtNodes = getPRTNodes(question,prt);
    if (prtNodes == null){
        return;
    }

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
    let pageHeader = document.getElementById("pageHeader");
    pageHeader.innerHTML = getCourseFullName(id);
    document.title = getCourseShortName(id);

    //set Quiz options
    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuiz.append(opt);
    let quizList = getCourseQuizList(id);
    if (quizList != null){
        for (let i = 0; i < quizList.length;i++){
            opt = "<option value="+quizList[i].id+">"+quizList[i].name+"</option>"
            selectQuiz.append(opt);
        }
    }

}

init();