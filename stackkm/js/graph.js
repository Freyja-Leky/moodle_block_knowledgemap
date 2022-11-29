
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
                    console.log("weight"+nodeWeight[j].id+":"+nodeWeight[j].weight);
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
    }

    let categories = [];

    for (let i = 0; i < mapNodes.length;i++){
        let flag = false;
        for (let j = 0; j < categories.length;j++){
            if (categories[j].name == mapNodes[i].category){
                flag = true;
                break;
            }
        }
        if (!flag){
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