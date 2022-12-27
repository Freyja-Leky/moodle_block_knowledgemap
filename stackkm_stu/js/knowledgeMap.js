
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

//echarts option
let option = null;

function init() {

    //get courseId & return url from url
    id = getQueryVariable("id");
    url = getQueryVariable("url");

    url = url+"="+id;

    //set Navigation Bar Url
    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;

    let testFeedbackUrl = "testFeedback.html?id="+id+"&url="+url;
    let aTestFeedback = document.getElementById('aTestFeedback');
    aTestFeedback.href = testFeedbackUrl;

    let learningProgressUrl = "learningProgress.html?id="+id+"&url="+url;
    let alearningProgress = document.getElementById('aLearningProgress');
    alearningProgress.href = learningProgressUrl;

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

    //draw map
    option = drawKnowledgeMap(mapNodes,mapLinks);
    chart.setOption(option);
}

init();