
//Get UI
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



//data
let mapId = null;
let mapNodes = null;
let addNodesList = null;

let quizList = null;
let questionList = null;
let prtList = null;
let prtNodes = null;


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

//get mapNodes
function getMapNodes() {
    $.ajax({
        url:"knowledgeMap.php?query="+"mapNodes"+"&mapId="+mapId,
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
    $.ajax({
        url:"question.php?query="+"prtnodes"+"&question="+question+"&prt="+prt,
        async:false,
        success:function (data,status) {
            if (data != "Null") {
                prtNodes = JSON.parse(data);

                addNodesList = JSON.parse(JSON.stringify(mapNodes));
                console.log(addNodesList);
                for (let i = 0; i < prtNodes.length; i++){
                    for (let j = 0; j < addNodesList.length; j++){
                        if (prtNodes[i].id == addNodesList[j].id){
                            addNodesList.splice(j,1);
                        }
                    }
                }
            }
            else {
                addNodesList = JSON.parse(JSON.stringify(mapNodes));
            }
        }
    })

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

//init
function init(){

    let id = getQueryVariable("id");
    let url = getQueryVariable("url");

    url = url+"="+id;

    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;

    //set Title
    let fullName = null;
    let shortName = null;

    $.ajax({
        url:"question.php?query="+"fullname"+"&id="+id,
        success:function (data,status) {
            fullName = data;
            let pageHeader = document.getElementById("pageHeader");
            pageHeader.innerHTML = fullName;
        }
    })

    $.ajax({
        url:"question.php?query="+"shortname"+"&id="+id,
        success:function (data,status) {
            shortName = data;
            document.title = shortName;
        }
    })

    //set Quiz options
    let opt = "<option value='-1'>Nothing Selected</option>";
    selectQuiz.append(opt);

    $.ajax({
        url:"question.php?query="+"quizlist"+"&id="+id,
        success:function (data,status) {
            if (data != "Null"){
                quizList = JSON.parse(data);

                for (let i = 0;i<quizList.length;i++){
                    opt = "<option value="+quizList[i].id+">"+quizList[i].name+"</option>"
                    selectQuiz.append(opt);
                }
            }
        }
    })

    $.ajax({
        url:"knowledgeMap.php?query="+"mapId"+"&id="+id,
        async:false,
        success:function (data,status) {
            mapId = data;
        }
    })

    if (mapId == -1){
        console.log("no map in km");
        return;
    }

    getMapNodes();

    if (mapNodes == -1){
        console.log("no data in node_slot and clear the km");
        return;
    }

}

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
        url:"question.php?query="+"questions"+"&quiz="+quiz,
        success:function (data,status) {
            if (data != "Null") {
                questionList = JSON.parse(data);

                for (let i = 0; i < questionList.length; i++) {
                    let opt = "<option value=" + questionList[i].id + ">" + questionList[i].name + "</option>"
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
        url:"question.php?query="+"prt"+"&question="+question,
        success:function (data,status) {
            if (data != "Null") {
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
    let question = selectQuestion.val();
    let prt = selectPRT.val();

    getPRTMap(question,prt);
    //to do

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
        url:"question.php?query="+"addnode"+"&question="+question+"&prt="+prt+"&node="+node,
        async : false,
        success:function (data,status) {
            if (data == -1){
                window.alert("Node already existed");
            }
            else{
                window.alert("Succeed");
                getPRTMap(question,prt);
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
        window.alert("Quiz, question, and prt can not be empty");
        return;
    }

    $.ajax({
        url:"question.php?query="+"deletenode"+"&question="+question+"&prt="+prt+"&node="+node,
        async : false,
        success:function (data,status) {
            if (data == -1){
                console.log("Map not exist");
            }
            else{
                console.log(data);
                getPRTMap(question,prt);
            }
        }
    })

})


init();





