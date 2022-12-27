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

function getMapId(id) {

    let mapId = null;
    $.ajax({
        url:"data.php?query="+"getMapId"+"&id="+id,
        async:false,
        success:function (data,status) {
            mapId = data;
        }
    });

    return mapId;
}

function getCourseFullName(id){

    let courseFullName = null;

    $.ajax({
        url:"data.php?query="+"getCourseFullName"+"&id="+id,
        async: false,
        success:function (data,status) {
            courseFullName = data;
        }
    });

    return courseFullName;

}

function getCourseShortName(id) {

    let courseShortName = null;

    $.ajax({
        url:"data.php?query="+"getCourseShortName"+"&id="+id,
        async: false,
        success:function (data,status) {
            courseShortName = data;
        }
    });

    return courseShortName;
}

function getMapNodes(mapId) {

    let mapNodes = null;

    $.ajax({
        url:"knowledgeMap.php?query="+"getMapNodes"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                console.log("no map in database");
            }
            else if (data == -2){
                console.log("no data in map and delete the record");
            }
            else {
                mapNodes = JSON.parse(data);
            }
        }
    });

    return mapNodes;
}

function getMapLinks(mapId) {

    let mapLinks = null;

    $.ajax({
        url:"knowledgeMap.php?query="+"getMapLinks"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                console.log("no map in database");
            }
            else if (data == -2){
                console.log("no links but nodes exist");
            }
            else {
                mapLinks = JSON.parse(data);
            }
        }
    });

    return mapLinks;
}

function getUserAttempt(id) {

    let questionAttempts = null;

    $.ajax({
        url:"learningProgress.php?query="+"getUserAttempt"+"&id="+id,
        async:false,
        success:function (data,status) {
            if (data != -1){
                questionAttempts = JSON.parse(data);
            }
        }
    });

    return questionAttempts;
}

function getCourseQuizList(id) {

    let quizList = null;

    $.ajax({
        url:"testFeedback.php?query="+"getCourseQuizList"+"&id="+id,
        async:false,
        success:function (data,status) {
            if (data != -1){
                quizList = JSON.parse(data);
                }
            }
    });

    return quizList;
}

function getQuizAttempt(quiz){

    let attempt = null;

    $.ajax({
        url:"testFeedback.php?query="+"getQuizAttempt"+"&quiz="+quiz,
        async: false,
        success:function (data,status) {
            if (data == -1){
                pScore.text("-- / --");
                pTimestamp.text("update time");
            }
            else {
                attempt = JSON.parse(data);
                pScore.text(attempt.score+" / "+attempt.fullMark);
                pTimestamp.text(attempt.time);
            }
        }
    });

    return attempt;
}

function getQuestionAttempt(attempt,question) {

    let record = null;

    $.ajax({
        url:"testFeedback.php?query="+"getQuestionAttempt"+"&attempt="+attempt+"&question="+question,
        async:false,
        success:function (data,status) {
            if (data != -1) {
                record = data;
            }
        }
    });

    return record;
}

function getPRTNodes(question,prt) {

    let prtNodes = null;

    $.ajax({
        url:"testFeedback.php?query="+"getPRTNodes"+"&question="+question+"&prt="+prt,
        async:false,
        success:function (data,status) {
            if (data == -1){
                console.log("no prt map exist");
            }
            else if (data == -2){
                console.log("no prt slot with this map");
            }
            else if (data == -3){
                console.log("no node exist");
            }
            else {
                prtNodes = JSON.parse(data);
            }
        }
    });

    return prtNodes;
}
