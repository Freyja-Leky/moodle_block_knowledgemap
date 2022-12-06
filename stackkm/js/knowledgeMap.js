
//---------------------------UI---------------------------
//echarts div
let chart = echarts.init(document.getElementById('chart'));

//file part
let upload = $("#upload");
let download = $("#download");
let save = $("#save");

//add node
let nodeName = $("#nodeName");
let fieldName = $("#fieldName");
let addNode = $("#addNode");

//add edge
let fromSelect = $("#fromSelect");
let toSelect = $("#toSelect");
let addEdge = $("#addEdge");

//---------------------------Data---------------------------
//courseId & return url
let id = null;
let url = null;

//mapData
let mapId = null;
let mapNodes = null;
let mapLinks = null;
let nodeWeight = null;

//fileData
let dataBook = null;
let nodeData = null;
let linkData = null;

//echarts option
let option = null;

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

//set fromSelect & toSelect
function RefreshEdgeSelect(){

    fromSelect.find("option").remove();
    toSelect.find("option").remove();

    if (mapNodes == null || mapNodes == -1 || mapNodes.length < 1){
        return;
    }

    for (let i = 0; i < mapNodes.length; i++){
        let opt = "<option value="+mapNodes[i].id+">"+mapNodes[i].name+"</option>";
        fromSelect.append(opt);
        opt = "<option value="+mapNodes[i].id+">"+mapNodes[i].name+"</option>";
        toSelect.append(opt);
    }
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

//input file data
function setFileDataMap(nodeData,linkData) {

    mapNodes = [];
    mapLinks = [];

    for (let i = 0; i < nodeData.length; i++){
        mapNodes.push({"name":nodeData[i].Name,"category":nodeData[i].Field,"id":nodeData[i].__rowNum__});
    }

    for (let i =0 ; i < linkData.length; i++){
        let source = "";
        let target = "";
        for (j = 0 ; j < mapNodes.length; j++){
            if (mapNodes[j].name == linkData[i].Source){
                source = mapNodes[j].id;
                break;
            }
        }
        for (j = 0 ; j < mapNodes.length; j++){
            if (mapNodes[j].name == linkData[i].Target){
                target = mapNodes[j].id;
                break;
            }
        }
        // with blank delete the node
        if (source == "" || target == "")
            continue;

        mapLinks.push({"source":source,"target":target});
    }

}


function RefreshGraph() {
    chart.clear();

    window.onresize = function() {
        chart.resize();
    };

    getMapNodes();
    RefreshEdgeSelect();
    getMapLinks();
    calNodeWeight();

    option = drawKnowledgeMap(mapNodes,mapLinks,nodeWeight);
    chart.setOption(option);
}

//---------------------------UI function---------------------------

//input file excel
function handleFile(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function () {
        let data = e.target.result;
        dataBook = XLSX.read(reader.result);
    }
    reader.readAsArrayBuffer(file);
}

document.getElementById("mapDataInput").addEventListener("change",handleFile,false);

//with upload refresh the cache data
upload.click(function () {

    nodeName.val("");
    fieldName.val("");

    if (dataBook == null){
        window.alert("Please choose file");
        return;
    }

    //read notebook
    let nodeSheet = dataBook.Sheets[dataBook.SheetNames[0]];
    let linkSheet = dataBook.Sheets[dataBook.SheetNames[1]];

    nodeData = XLSX.utils.sheet_to_json(nodeSheet);
    linkData = XLSX.utils.sheet_to_json(linkSheet);

    //input data
    setFileDataMap(nodeData,linkData);
    calNodeWeight();

    //draw graph
    chart.clear();
    option = drawKnowledgeMap(mapNodes,mapLinks,nodeWeight);
    chart.setOption(option);

    addNode.attr("disabled",true);
    addEdge.attr("disabled",true);
})

//download the excel model or data
download.click(function () {

    nodeData = [];
    linkData = [];

    nodeData.push(["Name","Field"]);
    linkData.push(["Source","Target"]);

    if (mapNodes != null && mapNodes != -1 && mapNodes.length > 0){
        for (let i = 0 ; i < mapNodes.length; i++){
            nodeData.push([mapNodes[i].name,mapNodes[i].category]);
        }
    }

    if (mapLinks != null && mapLinks != -1 && mapLinks.length > 0){
        for (let i = 0 ; i < mapLinks.length; i++){
            let sourceName = null;
            let targetName = null;

            for (let j = 0; j < mapNodes.length; j++){
                if (mapNodes[j].id == mapLinks[i].source){
                    sourceName = mapNodes[j].name;
                    break;
                }
            }
            for (let j = 0; j < mapNodes.length; j++){
                if (mapNodes[j].id == mapLinks[i].target){
                    targetName = mapNodes[j].name;
                    break;
                }
            }

            if (sourceName == null || targetName == null)
                continue;

            linkData.push([sourceName,targetName]);
        }
    }

    let workbook = XLSX.utils.book_new();
    let nodeSheet = XLSX.utils.aoa_to_sheet(nodeData);
    let linkSheet = XLSX.utils.aoa_to_sheet(linkData);
    XLSX.utils.book_append_sheet(workbook,nodeSheet,"Nodes");
    XLSX.utils.book_append_sheet(workbook,linkSheet,"Links");
    XLSX.writeFile(workbook,"MapData.xlsx");
})

//save data into database
save.click(function () {

    nodeName.val("");
    fieldName.val("");

    //save nodes into DB
    let data = "nodes=" +JSON.stringify(mapNodes);

    $.ajax({
        type: "post",
        url: "knowledgeMap.php?query="+"updateMapNodes"+"&mapId="+mapId+"&id="+id,
        async: false,
        data: data,
        success: function (data) {
            console.log(data);
        }
    });

    getMapId();

    //save nodes into DB
    data = "links=" + JSON.stringify(linkData);

    $.ajax({
        type: "post",
        url: "knowledgeMap.php?query="+"updateMapLinks"+"&mapId="+mapId,
        async: false,
        data: data,
        success: function (data) {
            console.log(data);
        }
    });

    RefreshGraph();

    addNode.attr("disabled",false);
    addEdge.attr("disabled",false);
})

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

    let insert = true;


    if (mapId == -1){
        $.ajax({
            url:"knowledgeMap.php?query="+"insertMap"+"&id="+id,
            async: false,
            success:function (data,status) {
                    console.log("insert map as "+ data);
                }
        })
    }

    getMapId();

    $.ajax({
        url:"knowledgeMap.php?query="+"insertNode"+"&name="+name+"&field="+field+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                insert = false;
            }
        }
    })

    if (!insert){
        window.alert("Node already exist");
        return;
    }
    else{
        nodeName.val("");
        fieldName.val("");
        window.alert("Add node succeed");
    }

    RefreshGraph();

})

addEdge.click(function () {

    let toNode = toSelect.val();
    let fromNode = fromSelect.val();

    if (toNode == fromNode){
        window.alert("Same node selected");
        return;
    }

    $.ajax({
        url:"knowledgeMap.php?query="+"insertLink"+"&to="+toNode+"&from="+fromNode+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                window.alert("Link already exist");
            }
            else if (data == -1){
                console.log("no map exists");
            }
            else
                window.alert("Add link succeed");
        }
    })

    RefreshGraph();

})

function init() {

    //get courseId & return url from url
    id = getQueryVariable("id");
    url = getQueryVariable("url");

    url = url+"="+id;

    let aCourse = document.getElementById('aCourse');
    aCourse.href = url;

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

    RefreshEdgeSelect();

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