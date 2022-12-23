//for knowledgeMap.js
function drawKnowledgeMap(mapNodes,mapLinks,nodeWeight){
    let nodes = [];
    let links = [];

    // with no link
    if (mapLinks != -1){
        links = mapLinks;
    }

    //set size with weight
    if (mapNodes != -1){
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
                    show: weight > 20
                }
            })
        }
    }

    //set catrgory
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


    let option = {
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
                        width: 10
                    }
                }
            }
        ]
    };

    return option;
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

    let option = {
        legend:[
            {
                data: ["Learnt","Failed"]
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

    return option;
}

function drawProgressGraph(mapNodes,mapLinks,nodeWeight,nodeStatus) {

    let nodes = [];
    let links = [];

    if (mapNodes == null || mapNodes.length < 1){
        return null;
    }

    // with no link
    if (mapLinks != -1){
        links = mapLinks;
    }

    for (let i = 0; i < mapNodes.length; i++){
        let flag = false;
        for (let j = 0 ; j < nodeStatus.length; j++){
            if (mapNodes[i].id == nodeStatus[j].id){
                flag = true;
                nodes.push(({
                    id: mapNodes[i].id,
                    name: mapNodes[i].name,
                    itemStyle:{
                        color: "rgba(100,149,237,"+nodeStatus[j].transparency+")",
                        borderColor: '#000000',
                        borderWidth: 0.5
                    },
                    category: mapNodes[i].category
                }));
                break;
            }
        }
        if (!flag){
            nodes.push(({
                id: mapNodes[i].id,
                name: mapNodes[i].name,
                symbolSize : 10,
                itemStyle:{
                    color: "rgba(255,255,255,1)",
                    borderColor: '#000000',
                    borderWidth: 0.5
                },
                category: mapNodes[i].category,
                label:{
                    show: false
                }
            }));
        }
    }

    for (let i =0; i < nodeWeight.length; i++){
        for (let j =0; j < nodes.length;j++){
            if (nodeWeight[i].id == nodes[j].id){
                nodes[j].symbolSize = nodeWeight[i].weight;
                nodes[j].label = {
                    show: nodeWeight[i].weight > 20
                }
                break;
            }
        }
    }

    //set catrgory
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

    let option = {
        tooltip: {
            show: true,
            formatter: function (params) {
                return params.data.name;
            }
        },
        // legend: [
        //     {
        //         data: categories.map(function (a) {
        //             return a.name;
        //         })
        //     }
        // ],
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
                        width: 10
                    }
                }
            }
        ]
    };

    console.log(option);

    return option;

}