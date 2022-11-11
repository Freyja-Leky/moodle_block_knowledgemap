
//Get UI

let selectQuiz = document.getElementById('quizSelect');
let selectQuestion = document.getElementById('questionSelect');
let selectPRT = document.getElementById('PRTSelect');

//init
function init(){

    let opt = new Option("Nothing Selected",-1);
    selectQuiz.options.add(opt);
    opt = new Option("Nothing Selected",-1);
    selectQuestion.options.add(opt);
    opt = new Option("Nothing Selected",-1);
    selectPRT.options.add(opt);

    for (let i = 0; i < quizNameList.length; i++){
        let opt = new Option(quizNameList[i],i);
        selectQuiz.options.add(opt);
    }

}

// require(['jQuery',function ($) {
//
//     selectQuestion.change(function () {
//         console.log("11111");
//     })
//
// }])

function changeQuiz(){

}


function changeQuestion(){

}

function changePRT() {

}


init();





