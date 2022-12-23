
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
let nodeWeight = null;
let nodesPRT = null;
let nodesStatus = null;
let percent = 0;

//Data
let questionAttempts = null;

//echarts option
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

//get mapId
function getMapId() {
    $.ajax({
        url:"knowledgeMap.php?query="+"getMapId"+"&id="+id,
        async:false,
        success:function (data,status) {
            mapId = data;
        }
    })
}

//get mapNodes
function getMapNodes() {
    $.ajax({
        url:"knowledgeMap.php?query="+"getMapNodes"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                mapNodes = data;
            }
            else {
                mapNodes = JSON.parse(data);
            }
        }
    })
}

//get mapLinks
function getMapLinks() {
    $.ajax({
        url:"knowledgeMap.php?query="+"getMapLinks"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                mapLinks = data;
            }
            else {
                mapLinks = JSON.parse(data);
            }
        }
    })
}

//calculate nodeWeight
function calNodeWeight(){
    nodeWeight = [];

    if (mapLinks == -1){
        return;
    }

    for (let i = 0; i < mapLinks.length; i++){
        let nodeExist = false;
        for (let j = 0; j < nodeWeight.length; j++){
            if (mapLinks[i].source == nodeWeight[j].id){
                nodeWeight[j].weight+=3;
                nodeExist = true;
                break;
            }
        }
        if (!nodeExist){
            nodeWeight.push({id:mapLinks[i].source,weight:10});
        }
        nodeExist = false;
        for (let j = 0; j < nodeWeight.length; j++){
            if (mapLinks[i].target == nodeWeight[j].id){
                nodeWeight[j].weight+=3;
                nodeExist = true;
                break;
            }
        }
        if (!nodeExist){
            nodeWeight.push({id:mapLinks[i].target,weight:10});
        }
    }

}

function calNodeStatus(){
    console.log(nodesPRT);

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

    console.log(nodesStatus);
}

function calPercent(){

    let nodeNum = mapNodes.length;
    if (nodeNum == 0){
        percent = 0;
        return
    }


    let point = 0;
    for (let i = 0 ; i < nodesStatus.length; i++){
        point += nodesStatus[i].transparency;
    }

    percent = (100*point/nodeNum).toFixed(2);

    progressBar.width(percent+"%");

    if (percent >= 10){
        progressBar.text(percent+"%");
    }
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

    //Map Id
    getMapId();
    if (mapId == -1){
        console.log("no map in km");
        return;
    }

    //Map Nodes
    getMapNodes();
    if (mapNodes == -1){
        console.log("no data in node_slot and clear the km");
        return;
    }

    //Map Links
    getMapLinks();
    if (mapLinks == -1){
        console.log("no links but nodes exist");
    }
    calNodeWeight();


    $.ajax({
        url:"learningProgress.php?query="+"getUserAttempt"+"&id="+id,
        async:false,
        success:function (data,status) {
            if (data!=-1){
                questionAttempts = JSON.parse(data);
            }
        }
    })

    console.log(questionAttempts);

    if (questionAttempts == null || questionAttempts.length < 1){
        return;
    }

    let questionPRTs = [];

    for (let i = 0; i < questionAttempts.length; i++){
        let scorePattern = new RegExp("score");
        if (!scorePattern.test(questionAttempts[i].summary)){
            continue;
        }
        let seed = questionAttempts[i].summary.split(/[:,;,\[,\],|]/);
        questionPRTs.push({"questionId":questionAttempts[i].questionId,"prt":seed[seed.length-1].trim()})
    }

    console.log(questionPRTs);

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
    calPercent();

    option = drawProgressGraph(mapNodes,mapLinks,nodeWeight,nodesStatus);
    chart.setOption(option);

}

init();