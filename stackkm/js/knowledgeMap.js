
//Get UI
let chart = echarts.init(document.getElementById('chart'));

let nodeName = $("#nodeName");
let fieldName = $("#fieldName");
let addNode = $("#addNode");

let fromSelect = $("#fromSelect");
let toSelect = $("#toSelect");
let addEdge = $("#addEdge");

//data
let id = null;
let url = null;

let mapId = null;
let mapNodes = null;
let nodeWeight = null;
let mapLinks = null;

let option = null;

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
            mapNodes = JSON.parse(data);
            console.log(mapNodes);
        }
    })
}

function getMapLinks() {
    $.ajax({
        url:"knowledgeMap.php?query="+"mapLinks"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            mapLinks = JSON.parse(data);
        }
    })
}

function calNodeWeight(){
    nodeWeight = [];

    for (let i = 0; i < mapLinks.length; i++){
        for (let j = 0; j < nodeWeight.length; j++){
            if (mapLinks[i].source == nodeWeight[j].id){
                nodeWeight[j].weight+=2;
                break;
            }
            nodeWeight.push({id:mapLinks[i].source,weight:10});
        }
        for (let j = 0; j < nodeWeight.length; j++){
            if (mapLinks[i].target == nodeWeight[j].id){
                nodeWeight[j].weight+=2;
                break;
            }
            nodeWeight.push({id:mapLinks[i].target,weight:10});
        }
    }
    console.log(nodeWeight);
}

function RefreshEdgeSelect(){

    fromSelect.find("option").remove();
    toSelect.find("option").remove();

    for (let i = 0; i < mapNodes.length; i++){
        let opt = "<option value="+mapNodes[i].id+">"+mapNodes[i].name+"</option>";
        fromSelect.append(opt);
        opt = "<option value="+mapNodes[i].id+">"+mapNodes[i].name+"</option>";
        toSelect.append(opt);
    }

}

function init() {

    id = getQueryVariable("id");
    url = getQueryVariable("url");

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

    getMapNodes();

    if (mapNodes == -1){
        console.log("no data in node_slot and clear the km");
        return;
    }

    RefreshEdgeSelect();

    getMapLinks();

    if (mapLinks == -1){
        console.log("no links but nodes exist");
    }

    calNodeWeight();

    option = drawKnowledgeMap(mapNodes,mapLinks,nodeWeight);
    
    console.log(option);

    chart.setOption(option);
}

addNode.click(function (){

    let name = nodeName.val();
    let field = fieldName.val();

    if (!name){
        window.alert("Node name can not be empty");
        return;
    }
    
    if (!field){
        window.alert("Node field can not be empty");
    }

    var insert = true;

    if (mapId == -1){

        $.ajax({
            url:"knowledgeMap.php?query="+"insertFirstNode"+"&name="+name+"&field="+field+"&id="+id,
            async: false,
            success:function (data,status) {
                if (data == -1){
                    insert = false;
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

    }
    else {

        $.ajax({
            url:"knowledgeMap.php?query="+"insertOneNode"+"&name="+name+"&field="+field+"&mapId="+mapId,
            async: false,
            success:function (data,status) {
                if (data == -1){
                    insert = false;
                }
            }
        })
    }

    if (!insert){
        window.alert("Node already exist");
        return;
    }
    else
        window.alert("Add node succeed");

    RefreshEdgeSelect();

    //todo
    chart.clear();

})



addEdge.click(function () {

    let toNode = toSelect.val();
    let fromNode = fromSelect.val();

    if (toNode == fromNode){
        window.alert("Same node selected");
        return;
    }

    // $.ajax({
    //     url:"knowledgeMap.php?query="+"test"+"&to="+2+"&from="+3,
    //     async: false,
    //     success:function (data,status) {
    //         console.log(data);
    //     }
    // })

    $.ajax({
        url:"knowledgeMap.php?query="+"insertLink"+"&to="+toNode+"&from="+fromNode+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            console.log(data);
            if (data == -1){
                window.alert("Link already exist");
            }
            else
                window.alert("Add link succeed");
        }
    })

})


init();