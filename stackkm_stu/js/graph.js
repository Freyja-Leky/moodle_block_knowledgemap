
function calNodeWeight(mapNodes,mapLinks){


    if (mapLinks == null){
        return null;
    }

    let nodeWeight = [];

    for (let i = 0; i < mapLinks.length; i++){

        //source node in link
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

        //target node in link
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

    return nodeWeight;
}

function constructNodesWithSymbolSize(mapNodes,nodeWeight){

    let nodes = [];

    if (mapNodes != null){
        for (let i = 0; i < mapNodes.length;i++){
            let weight = 10;
            for (let j = 0; j < nodeWeight.length;j++){
                if (mapNodes[i].id == nodeWeight[j].id)
                {
                    weight = nodeWeight[j].weight;
                    break;
                }
            }
            nodes.push({
                id : mapNodes[i].id,
                name : mapNodes[i].name,
                symbolSize : weight,
                category : mapNodes[i].category,
                label: {
                    show: weight > 18
                }
            })
        }
    }

    return nodes;

}

function constructCategory(mapNodes) {

    let categories = [];

    for (let i = 0; i < mapNodes.length;i++){
        let exist = false;
        for (let j = 0; j < categories.length;j++){
            if (categories[j].name == mapNodes[i].category){
                exist = true;
                break;
            }
        }
        if (!exist){
            categories.push({"name": mapNodes[i].category});
        }
    }

    return categories;
}

//for knowledgeMap.js
function drawKnowledgeMap(mapNodes,mapLinks){
    let nodes = [];
    let links = [];

    if (mapNodes == null || mapNodes.length < 1){
        return null;
    }

    // with no link
    if (mapLinks != null){
        links = mapLinks;
    }

    //set size with weight
    let nodeWeight = calNodeWeight(mapNodes,mapLinks);
    nodes = constructNodesWithSymbolSize(mapNodes,nodeWeight);

    //set category
    let categories = constructCategory(mapNodes);

    return {
        tooltip: {
            show: true,
            formatter: function (params) {
                return params.data.name;
            }
        },
        legend: [
            {
                data: categories.map(function (a) {
                    return a.name;
                })
            }
        ],
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                categories: categories,
                roam: true,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                },
                force: {
                    repulsion: 500
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    },
                    label: {
                        show: true
                    }
                }
            }
        ]
    };
}


//for feedback.js
function drawPRTMap(prtNodes) {
    let nodes = [];
    let links = [];

    if (prtNodes == null || prtNodes.length < 1){
        return null;
    }

    nodes.push({
        id: 0,
        name: "問題",
        itemStyle: {
            color:'#ffffff',
            borderColor: '#6667AB'},
        symbolSize: 40
    });

    for (let i = 0; i < prtNodes.length; i++){
        if (prtNodes[i].status == 1){
            nodes.push({
                id: i+1,
                name: prtNodes[i].name,
                itemStyle:{
                    color: '#6667AB',
                    borderColor: '#E6E6FA',
                    borderWidth: 3
                },
                category: 'Learnt'
            });
        }
        else {
            nodes.push({
                id: i+1,
                name: prtNodes[i].name,
                itemStyle:{
                    color: '#F8F8FF',
                    borderColor: '#E6E6FA',
                    borderWidth: 1.5,
                    borderType: "dashed",
                },
                label:{
                    color: 'rgba(0,0,0,0.5)'
                },
                category: 'Failed'
            });
        }
    }

    for (let i = 1; i < nodes.length; i++){
        links.push({
            source: nodes[0].id,
            target: nodes[i].id
        })
    }

    return {
        legend: [
            {
                data: ["Learnt", "Failed"]
            }
        ],
        series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 35,
            data: nodes,
            links: links,
            roam: true,
            // center: ['50%', '50%'],
            label: {
                show: true,
                position: 'right',
                formatter: '{b}'
            },
            lineStyle: {
                color: '#6667AB',
                curveness: 0.3
            },
            force: {
                repulsion: 500
            },
            categories: [
                {
                    name: "Learnt",
                    itemStyle: {
                        color: '#6667AB',
                        borderColor: '#E6E6FA',
                        borderWidth: 3
                    }
                },
                {
                    name: "Failed",
                    itemStyle: {
                        color: '#F8F8FF',
                        borderColor: '#E6E6FA',
                        borderWidth: 1.5,
                        borderType: "dashed",
                    }
                }
            ]
        }]
    };
}

//for learningProgress.js
function drawProgressGraph(mapNodes,mapLinks,nodeStatus) {

    let nodes = [];
    let links = [];

    if (mapNodes == null || mapNodes.length < 1){
        return null;
    }

    // with no link
    if (mapLinks != null){
        links = mapLinks;
    }


    //set size with weight
    let nodeWeight = calNodeWeight(mapNodes,mapLinks);
    nodes = constructNodesWithSymbolSize(mapNodes,nodeWeight);

    //set category
    let categories = constructCategory(mapNodes);

    for (let i = 0; i < nodes.length; i++){
        let statusExist = false;
        for (let j = 0 ; j < nodeStatus.length; j++){
            if (nodes[i].id == nodeStatus[j].id){
                statusExist = true;
                nodes[i].itemStyle = {
                    color: "rgba(100,149,237,"+nodeStatus[j].transparency+")",
                    borderColor: '#000000',
                    borderWidth: 0.5
                }
                break;
            }
        }
        if (!statusExist){
            nodes[i].itemStyle = {
                color: "rgba(255,255,255,1)",
                borderColor: '#000000',
                borderWidth: 0.5
            }
        }
    }

    return {
        tooltip: {
            show: true,
            formatter: function (params) {
                return params.data.name;
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                categories: categories,
                roam: true,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: '#000000',
                    curveness: 0.3,
                },
                force: {
                    repulsion: 500
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    },
                    label: {
                        show: true
                    }
                }
            }
        ]
    };
}