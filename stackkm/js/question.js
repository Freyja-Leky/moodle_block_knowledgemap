
//---------------------------UI---------------------------
//echarts div
let chart = echarts.init(document.getElementById('chart'));
window.onresize = function() {
    chart.resize();
};

let selectQuiz = $("#quizSelect");
let selectQuestion = $("#questionSelect");
let selectPRT = $("#PRTSelect");
let btnRefresh = $("#Refresh");

let selectAdd = $("#addNodeSelect");
let btnAdd = $("#addNode");
let selectDelete = $("#deleteNodeSelect");
let btnDelete = $("#deleteNode");

let selectSet = $("#setNodeSelect");
let selectState = $("#stateSelect");
let btnSave = $("#Save");

//---------------------------Data---------------------------
//courseId & return url
let id = null;
let url = null;

//echarts option
let option = null;

//data
let mapId = null;
let mapNodes = null;


let quizList = null;
let questionList = null;
let prtList = null;

let prtNodes = null;
let addNodesList = null;

//---------------------------Function---------------------------
//get url variables
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

//get prtmap
function getPRTMap(question,prt) {

    addNodesList = JSON.parse(JSON.stringify(mapNodes));
    prtNodes = null;

    $.ajax({
        url:"question.php?query="+"getPRTNodes"+"&question="+question+"&prt="+prt,
        async:false,
        success:function (data,status) {
            if (data != -1) {
                prtNodes = JSON.parse(data);
                for (let i = 0; i < prtNodes.length; i++) {
                    for (let j = 0; j < addNodesList.length; j++) {
                        if (prtNodes[i].id == addNodesList[j].id) {
                            addNodesList.splice(j, 1);
                        }
                    }
                }
            }
        }
    })

}

function refreshAdd(){
    //renew add
    selectAdd.find("option").remove();

    if (addNodesList == null || addNodesList.length < 1){
        let opt = "<option value=" + -1 + ">" + "No option" + "</option>";
        selectAdd.append(opt);
    }
    else {
        for (let i = 0; i < addNodesList.length; i++){
            let opt = "<option value=" + addNodesList[i].id + ">" + addNodesList[i].name + "</option>";
            selectAdd.append(opt);
        }
    }
}

function refreshDelete() {
    //renew delete
    selectDelete.find("option").remove();

    if (prtNodes == null || prtNodes.length < 1){
        let opt = "<option value=" + -1 + ">" + "No option" + "</option>";
        selectDelete.append(opt);
    }
    else {
        for (let i = 0; i < prtNodes.length; i++){
            let opt = "<option value=" + prtNodes[i].id + ">" + prtNodes[i].name + "</option>";
            selectDelete.append(opt);
        }
    }
}

function refreshSet() {
    //renew set
    selectSet.find("option").remove();

    if (prtNodes == null || prtNodes.length < 1){
        let opt = "<option value=" + -1 + ">" + "No option" + "</option>";
        selectSet.append(opt);
    }
    else {
        for (let i = 0; i < prtNodes.length; i++){
            let opt = "<option value=" + prtNodes[i].id + ">" + prtNodes[i].name + "</option>";
            selectSet.append(opt);
        }
    }
}

function refreshSelect() {

    refreshAdd();

    refreshDelete();

    refreshSet();
}

function refreshGraph() {
    chart.clear();

    window.onresize = function() {
        chart.resize();
    };

    option = drawPRTMap(prtNodes);
    if (option == null){
        return;
    }
    chart.setOption(option);
}

//---------------------------UI function---------------------------

selectQuiz.change(function () {
    //clear options
    selectQuestion.find("option").remove();
    selectPRT.find("option").remove();

    let quiz = $(this).val();
    if (quiz == -1){
        return;
    }

    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuestion.append(opt);

    $.ajax({
        url:"question.php?query="+"getQuizQuestionList"+"&quiz="+quiz,
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
    //clear options
    selectPRT.find("option").remove();

    let question = $(this).val();
    if (question == -1){
        return;
    }

    let opt = "<option value='-1'>Nothing Selected</option>";
    selectPRT.append(opt);

    $.ajax({
        url:"question.php?query="+"getQuestionPRTList"+"&question="+question,
        success:function (data,status) {
            if (data != -1) {
                prtList = JSON.parse(data);
                for (let i = 0; i < prtList.length; i++) {
                    let opt = "<option value=" + prtList[i]+ ">" + prtList[i] + "</option>"
                    selectPRT.append(opt);
                }
            }
        }
    })
})


btnRefresh.click(function () {
    let quiz = selectQuiz.val();
    let question = selectQuestion.val();
    let prt = selectPRT.val();

    if (quiz == '-1' || question == '-1' || prt == '-1'){
        window.alert("Quiz, question, and prt can not be empty");
        return;
    }

    getPRTMap(question,prt);
    refreshSelect();
    refreshGraph();
})


btnAdd.click(function () {
    let quiz = selectQuiz.val();
    let question = selectQuestion.val();
    let prt = selectPRT.val();
    let node = selectAdd.val();

    if (quiz == -1 || question == -1 || prt == -1 || node == -1){
        window.alert("Quiz, question, and prt can not be empty");
        return;
    }

    $.ajax({
        url:"question.php?query="+"insertPRTNode"+"&question="+question+"&prt="+prt+"&node="+node,
        async : false,
        success:function (data,status) {
            if (data == -1){
                window.alert("Node already existed");
            }
            else{
                window.alert("Succeed");
                getPRTMap(question,prt);
                refreshSelect();
                refreshGraph();
            }
        }
    })
})


btnDelete.click(function () {
    let quiz = selectQuiz.val();
    let question = selectQuestion.val();
    let prt = selectPRT.val();
    let node = selectDelete.val();


    if (quiz == -1 || question == -1 || prt == -1 || node == -1){
        window.alert("Please select node");
        return;
    }

    $.ajax({
        url:"question.php?query="+"deletePRTNode"+"&question="+question+"&prt="+prt+"&node="+node,
        async : false,
        success:function (data,status) {
            if (data == -1){
                console.log("Map not exist");
            }
            else{
                window.alert("Succeed");
                getPRTMap(question,prt);
                refreshSelect();
                refreshGraph();
            }
        }
    })
})

btnSave.click(function () {
    let quiz = selectQuiz.val();
    let question = selectQuestion.val();
    let prt = selectPRT.val();
    let node = selectSet.val();
    let status = selectState.val();

    if (quiz == -1 || question == -1 || prt == -1 || node == -1){
        window.alert("Please select node");
        return;
    }

    $.ajax({
        url:"question.php?query="+"setStatus"+"&question="+question+"&prt="+prt+"&node="+node+"&status="+status,
        async : false,
        success:function (data,status) {
            getPRTMap(question,prt);
            refreshGraph()
        }
    })
})

//init
function init(){

    //get courseId & return url from url
    id = getQueryVariable("id");
    url = getQueryVariable("url");

    url = url+"="+id;

    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;
    let knowledgeMapUrl = "knowledgeMap.html?id="+id+"&url="+url;
    let aknowledgeMap = document.getElementById('aKnowledgeMap');
    aknowledgeMap.href = knowledgeMapUrl;

    //set Title
    let fullName = null;
    let shortName = null;

    $.ajax({
        url:"question.php?query="+"getCourseFullName"+"&id="+id,
        success:function (data,status) {
            fullName = data;
            let pageHeader = document.getElementById("pageHeader");
            pageHeader.innerHTML = fullName;
        }
    })

    $.ajax({
        url:"question.php?query="+"getCourseShortName"+"&id="+id,
        success:function (data,status) {
            shortName = data;
            document.title = shortName;
        }
    })

    //set Quiz options
    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuiz.append(opt);

    $.ajax({
        url:"question.php?query="+"getCourseQuizList"+"&id="+id,
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

}

init();





