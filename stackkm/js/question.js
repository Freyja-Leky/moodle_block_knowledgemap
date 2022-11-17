
//Get UI
let selectQuiz = $("#quizSelect");
let selectQuestion = $("#questionSelect");
let selectPRT = $("#PRTSelect");
let btnRefresh = $("#Refresh");


//data
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

    $.ajax({
        url:"question.php?query="+"prtnodes"+"&question="+question+"&prt="+prt,
        success:function (data,status) {
            if (data != "Null") {
                //to do

            }
            else {
                console.log("NULL");
            }
        }
    })

})



init();





