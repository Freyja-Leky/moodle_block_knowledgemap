
//---------------------------UI---------------------------
//echarts div
let chart = echarts.init(document.getElementById('chart'));

//---------------------------Data---------------------------
//courseId & return url
let id = null;
let url = null;

//mapData
let mapId = null;
let mapNodes = null;
let mapLinks = null;
let nodeWeight = null;

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

function init() {

    //get courseId & return url from url
    id = getQueryVariable("id");
    url = getQueryVariable("url");

    url = url+"="+id;

    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;

    let testFeedbackUrl = "testFeedback.html?id="+id+"&url="+url;
    let aTestFeedback = document.getElementById('aTestFeedback');
    aTestFeedback.href = testFeedbackUrl;

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

    //draw map
    option = drawKnowledgeMap(mapNodes,mapLinks,nodeWeight);
    chart.setOption(option);
}

init();