
//Get UI
let chart = echarts.init(document.getElementById('chart'));

let nodeName = $("#nodeName");
let fieldName = $("#fieldName");
let addNode = $("#addNode");

let fromSelect = $("#fromSelect");
let toSelect = $("#toSelect");
let addEdge = $("#addEdge");
let download = $("#download");
let upload = $("#upload");
let save = $("#save");

//data
let id = null;
let url = null;

let mapId = null;
let mapNodes = null;
let nodeWeight = null;
let mapLinks = null;

let dataBook = null;
let nodeData = null;
let linkData = null;

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
            if (data == -1){
                mapNodes = data;
            }
            else {
                mapNodes = JSON.parse(data);
            }
        }
    })
}

function getMapLinks() {
    $.ajax({
        url:"knowledgeMap.php?query="+"mapLinks"+"&mapId="+mapId,
        async: false,
        success:function (data,status) {
            if (data == -1){
                mapLinks = -1;
            }
            else {
                mapLinks = JSON.parse(data);
            }
        }
    })
}

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
        if (source == "" || target == "")
            continue;
        mapLinks.push({"source":source,"target":target});
    }

    console.log(mapNodes);
    console.log(mapLinks);
}

function calNodeWeight(){
    nodeWeight = [];

    if (mapLinks == -1){
        return;
    }

    for (let i = 0; i < mapLinks.length; i++){
        let flag = false;
        for (let j = 0; j < nodeWeight.length; j++){
            if (mapLinks[i].source == nodeWeight[j].id){
                nodeWeight[j].weight+=3;
                flag = true;
                break;
            }
        }
        if (!flag){
            nodeWeight.push({id:mapLinks[i].source,weight:10});
        }
        flag = false;
        for (let j = 0; j < nodeWeight.length; j++){
            if (mapLinks[i].target == nodeWeight[j].id){
                nodeWeight[j].weight+=3;
                flag = true;
                break;
            }
        }
        if (!flag){
            nodeWeight.push({id:mapLinks[i].target,weight:10});
        }
    }

}

function RefreshGraph() {
    chart.clear();

    getMapNodes();
    getMapLinks();
    calNodeWeight();

    option = drawKnowledgeMap(mapNodes,mapLinks,nodeWeight);
    chart.setOption(option);
}

function RefreshEdgeSelect(){

    fromSelect.find("option").remove();
    toSelect.find("option").remove();

    getMapNodes();

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
            else
                window.alert("Add link succeed");
        }
    })

    RefreshGraph();

})

download.click(function () {

    console.log("download");
    nodeData = [];
    linkData = [];

    nodeData.push(["Name","Field"]);
    linkData.push(["Source","Target"]);


    if (mapNodes != null && mapNodes.length > 0){
        for (let i = 0 ; i < mapNodes.length; i++){
            nodeData.push([mapNodes[i].name,mapNodes[i].category]);
        }
    }

    if (mapLinks != null && mapLinks.length > 0){
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
            linkData.push([sourceName,targetName]);
        }
    }

    let workbook = XLSX.utils.book_new();
    let nodeSheet = XLSX.utils.aoa_to_sheet(nodeData);
    let linkSheet = XLSX.utils.aoa_to_sheet(linkData);
    XLSX.utils.book_append_sheet(workbook,nodeSheet,"Node");
    XLSX.utils.book_append_sheet(workbook,linkSheet,"Link");
    XLSX.writeFile(workbook,"MapData.xlsx");
})

//input file excel
function handleFile(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function () {
        let data = e.target.result;
        dataBook = XLSX.read(reader.result);
        console.log(dataBook);
    }
    reader.readAsArrayBuffer(file);
}


document.getElementById("mapDataInput").addEventListener("change",handleFile,false);

upload.click(function () {

    if (dataBook == null){
        window.alert("Please choose file");
        return;
    }

    let nodeSheet = dataBook.Sheets[dataBook.SheetNames[0]];
    let linkSheet = dataBook.Sheets[dataBook.SheetNames[1]];

    nodeData = XLSX.utils.sheet_to_json(nodeSheet);
    linkData = XLSX.utils.sheet_to_json(linkSheet);

    setFileDataMap(nodeData,linkData);

    chart.clear();

    calNodeWeight();

    option = drawKnowledgeMap(mapNodes,mapLinks,nodeWeight);
    chart.setOption(option);

    addNode.attr("disabled",true);
    addEdge.attr("disabled",true);

    //to do
})

save.click(function () {

    let data = "nodes=" +JSON.stringify(mapNodes);

    $.ajax({
        type: "post",
        url: "knowledgeMap.php?query="+"filenodes"+"&mapId="+mapId,
        async: false,
        data: data,
        success: function (data) {
            console.log(data);
        }
    });

    data = "links=" + JSON.stringify(linkData);


    $.ajax({
        type: "post",
        url: "knowledgeMap.php?query="+"filelinks"+"&mapId="+mapId,
        async: false,
        data: data,
        success: function (data) {
            console.log(data);
        }
    });

    RefreshGraph();
    RefreshEdgeSelect();

    addNode.attr("disabled",false);
    addEdge.attr("disabled",false);
    //to do
})


init();