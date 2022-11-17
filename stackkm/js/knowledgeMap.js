
//Get UI
let chart = document.getElementById('chart');

//data
let mapData = null;

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

function init() {

    let id = getQueryVariable("id");
    let url = getQueryVariable("url");

    url = url+"="+id;

    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;

    //set Title
    let fullName = null;
    let shortName = null;

    $.ajax({
        url:"knowledgeMap.php?query="+"fullname"+"&id="+id,
        success:function (data,status) {
            fullName = data;
            let pageHeader = document.getElementById("pageHeader");
            pageHeader.innerHTML = fullName;
        }
    })

    $.ajax({
        url:"knowledgeMap.php?query="+"shortname"+"&id="+id,
        success:function (data,status) {
            shortName = data;
            document.title = shortName;
        }
    })

    //get Map from DB

    let mapId = null;

    $.ajax({
        url:"knowledgeMap.php?query="+"mapId"+"&id="+id,
        async:false,
        success:function (data,status) {
            mapId = data;
            console.log(mapId);
        }
    })

    if (mapId == -1){
        console.log("no map in km");
        return;
    }
    
    let mapNodes = null;
    let mapLinks = null;
    
    $.ajax({
        url:"knowledgeMap.php?query="+"mapNodes"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            mapNodes = data;
        }
    })

    if (mapNodes == -1){
        console.log("no data in node_slot and clear the km");
        return;
    }
    
    

}

$('#addNode').click(function (){

        // $.ajax({
        //     url:"knowledgeMap.php?query="+"insertMap"+"&id=1",
        //     success:function (data,status) {
        //         console.log(data);
        //     }
        // })
}
)

init();