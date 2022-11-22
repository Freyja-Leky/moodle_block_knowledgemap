
function drawKnowledgeMap(mapNodes,mapLinks,nodeWeight){
    let nodes = [];
    let links = [{source : 1, target : 2}];

    if (mapLinks != -1){
        links = mapLinks;
    }


    for (let i = 0; i < mapNodes.length;i++){
        let weight = 10;
        for (let j = 0; j < nodeWeight;j++){
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
                show: weight > 15
            }
        })
    }

    console.log(nodes);

    let option = {
        tooltip: {
            show: true,
            formatter: function (params) {
                return params.data.name;
            }
        },
        // legend: [
        //     {
        //         data: graph.categories.map(function (a) {
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
                  repulsion: 1000
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