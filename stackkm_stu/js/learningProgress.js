
//---------------------------UI---------------------------
//echarts div
let chart = echarts.init(document.getElementById('chart'));
let progressBar = $('#progress');

//---------------------------Data---------------------------
//courseId & return url
let id = null;
let url = null;

//mapData
let mapId = null;
let mapNodes = null;
let mapLinks = null;
let nodesPRT = null;
let nodesStatus = null;
let percent = 0;

//Data
let questionAttempts = null;

//echarts option
let option = null;


function calNodeStatus(){

    nodesStatus = [];

    let nodesPoint = [];

    for (let i = 0 ; i < nodesPRT.length;i++){
        let flag = false;
        for (let j = 0 ; j < nodesPoint.length; j++){
            if (nodesPoint[j].id == nodesPRT[i].node){
                nodesPoint[j].max++;
                if (nodesPRT[i].status == "1"){
                    nodesPoint[j].point++;
                }
                flag = true;
                break;
            }
        }
        if (!flag){
            if (nodesPRT[i].status == "1"){
                nodesPoint.push({"id":nodesPRT[i].node,"point":1,"max":1});
            }
            else {
                nodesPoint.push({"id":nodesPRT[i].node,"point":0,"max":1})  ;
            }
        }
    }

    for (let i = 0; i < nodesPoint.length; i++){
        nodesStatus.push({"id":nodesPoint[i].id,"transparency":Math.floor(100*nodesPoint[i].point/nodesPoint[i].max)/100});
    }

}

function calPercent(){

    if (mapNodes.length == 0){
        percent = 0;
        return
    }

    let point = 0;
    for (let i = 0 ; i < nodesStatus.length; i++){
        point += nodesStatus[i].transparency;
    }

    percent = (100*point/mapNodes.length).toFixed(2);
}

function setProgressBar() {

    progressBar.width(percent+"%");
    progressBar.text(percent+"%");
    
    // if (percent >= 10){
    //     progressBar.text(percent+"%");
    // }
}

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

    let testFeedbackUrl = "testFeedback.html?id="+id+"&url="+url;
    let aTestFeedback = document.getElementById('aTestFeedback');
    aTestFeedback.href = testFeedbackUrl;

    //set Title
    let pageHeader = document.getElementById("pageHeader");
    pageHeader.innerHTML = getCourseFullName(id);
    document.title = getCourseShortName(id);

    //Map Id
    mapId = getMapId(id);
    if (mapId == null){
        console.log("no map in database");
        return;
    }

    //Map Nodes
    mapNodes = getMapNodes(mapId);
    if (mapNodes == null){
        return;
    }

    //Map Links
    mapLinks = getMapLinks(mapId);

    //get question attempts
    questionAttempts = getUserAttempt(id);

    if (questionAttempts == null || questionAttempts.length < 1){
        return;
    }

    //construct query data
    let questionPRTs = [];

    for (let i = 0; i < questionAttempts.length; i++){
        let scorePattern = new RegExp("score");
        if (!scorePattern.test(questionAttempts[i].summary)){
            continue;
        }
        let seed = questionAttempts[i].summary.split(/[:,;,\[,\],|]/);
        questionPRTs.push({"questionId":questionAttempts[i].questionId,"prt":seed[seed.length-1].trim()})
    }

    let data = "data="+JSON.stringify(questionPRTs);

    $.ajax({
        type: "post",
        url: "learningProgress.php?query="+"getPRTList",
        async: false,
        data: data,
        success: function (data) {
            if (data != -1){
                nodesPRT = JSON.parse(data);
            }
        }
    });

    calNodeStatus();

    //progress bar
    calPercent();
    setProgressBar()

    option = drawProgressGraph(mapNodes,mapLinks,nodesStatus);
    chart.setOption(option);

}

init();