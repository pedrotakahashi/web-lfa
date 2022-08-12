$("#convertERtoAF").click(function () {

})

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);

    return string + this;
};

function convertAFtoER(Edges) {

    let ERString = "(";
    let simplifiedEdges = []

    // Simplifica o conjunto de arestas que tem mesma origem e destino
    Edges.forEach((edge, index) => {
        let simplifiedAdd = true;
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedAdd = false;
            }
        })
        if (simplifiedAdd) {
            simplifiedEdges.push({
                source: edge.source,
                target: edge.target,
                initial: edge.initial,
                final: edge.final,
                labels: []
            })
        }
    })

    // Adiciona os valores aceitos para cada conexão
    Edges.forEach((edge, index) => {
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedEdges[sIndex].labels.push(edge.label)
            }
        })
    })

    //Prepara links
    simplifiedEdges.forEach((sEdge, sIndex) => {
        sEdge.targets = [];
    })

    let cloneEdges = JSON.parse(JSON.stringify(simplifiedEdges));

    console.log(cloneEdges);



    simplifiedEdges.forEach((sEdge, sIndex) => {
        cloneEdges.forEach((cEdge, cIndex) => {
            if (sEdge.initial && cEdge.final && cEdge.source == sEdge.target)
                sEdge.targets.push(cEdge);
        })
    })

    console.log(simplifiedEdges);
    deepSearch(simplifiedEdges);



    function deepSearch(Edges, dIndex) {
        if (Array.isArray(Edges)) {

            Edges.forEach((sEdge, sIndex) => {
                console.log(sEdge.targets.length, sEdge)
                if (sEdge.targets.length > 0) {
                    if (sEdge.final == true && (sEdge.source != sEdge.target)) {
                        if (sEdge.source == sEdge.target) {
                            ERString = ERString.insert(ERString.length, "(")
                        }
                        sEdge.labels.forEach((label, index) => {
                            console.log(sEdge, label)
                            if (index == sEdge.labels.length - 1) {
                                ERString = ERString.insert(ERString.length, label);
                            } else {
                                ERString = ERString.insert(ERString.length, label[index] + "|");
                            }
                        })
                        if (sEdge.source == sEdge.target) {
                            ERString = ERString.insert(ERString.length, ")*")
                        }

                        if (sEdge.final == true)
                            ERString = ERString.insert(ERString.length, "|");

                    }

                    deeperSearch(sEdge.targets);
                } else if (sEdge.initial == true && sEdge.sIndex == 0) {
                    Edges.forEach(sEdge => {
                        if (sEdge.source == sEdge.target) {
                            ERString = ERString.insert(ERString.length, "(")
                        }
                        sEdge.labels.forEach((label, index) => {
                            console.log(sEdge, label)
                            if (index == sEdge.labels.length - 1) {
                                ERString = ERString.insert(ERString.length, label);
                            } else {
                                ERString = ERString.insert(ERString.length, label[index] + "|");
                            }
                        })
                        if (sEdge.source == sEdge.target) {
                            ERString = ERString.insert(ERString.length, ")*")
                        }

                        if (sEdge.final == true)
                            ERString = ERString.insert(ERString.length, "|");
                    })

                } else if (sEdge.initial == true) {
                    if (sEdge.source == sEdge.target) {
                        ERString = ERString.insert(ERString.length, "(")
                    }
                    sEdge.labels.forEach((label, index) => {
                        console.log(sEdge, label)
                        if (index == sEdge.labels.length - 1) {
                            ERString = ERString.insert(ERString.length, label);
                        } else {
                            ERString = ERString.insert(ERString.length, label[index] + "|");
                        }
                    })
                    if (sEdge.source == sEdge.target) {
                        ERString = ERString.insert(ERString.length, ")*")
                    }

                    if (sEdge.final == true)
                        ERString = ERString.insert(ERString.length, "|");
                }
            })
        }
    }


    function deeperSearch(Edges) {
        simplifiedEdges.forEach((sEdge) => {
            Edges.forEach((bEdge, bIndex) => {
                if (sEdge.target == bEdge.source) {

                    ERString = ERString.insert(ERString.length, "(")
                    sEdge.labels.forEach((label, index) => {
                        if (index == sEdge.labels.length - 1) {
                            ERString = ERString.insert(ERString.length, label);
                        } else {
                            ERString = ERString.insert(ERString.length, label[index] + "|");
                        }
                    })
                    ERString = ERString.insert(ERString.length, ")")
                    if (sEdge.source == sEdge.target) {
                        ERString = ERString.insert(ERString.length, "*")
                    }

                }
            })
        })

        Edges.forEach((sEdge, sIndex) => {
            ERString = ERString.insert(ERString.length, "(")
            sEdge.labels.forEach((label, index) => {
                console.log(sEdge, label)
                if (index == sEdge.labels.length - 1) {
                    ERString = ERString.insert(ERString.length, label);
                } else {
                    ERString = ERString.insert(ERString.length, label[index] + "|");
                }
            })
            ERString = ERString.insert(ERString.length, ")")
            if (sEdge.source == sEdge.target) {
                ERString = ERString.insert(ERString.length, "*")
            }

            if (sEdge.final == true)
                ERString = ERString.insert(ERString.length, "|");
        })
    }


    if (ERString[ERString.length - 1] == "|")
        ERString = ERString.slice(0, ERString.length - 1);
    ERString = ERString.insert(ERString.length, ")");
    console.log(ERString);

    $("#RegexGrammar").val(ERString);
}


$("#convertAFtoER").click(function () {
    // Declarando o vetor para os objetos.
    let initialNode, parsedEdges = [], parsedNodes = [];

    cy.edges().forEach(function (edge, index) {
        parsedEdges.push(edge.data());
        if (cy.getElementById(edge.data().source).data().initial == true)
            parsedEdges[index].initial = true;
        else
            parsedEdges[index].initial = false;
        parsedEdges[index].final = cy.getElementById(edge.data().target).data().final;
        parsedEdges[index].target = cy.getElementById(edge.data().target).data().label;
        parsedEdges[index].source = cy.getElementById(edge.data().source).data().label;
    });
    console.log(parsedEdges);
    convertAFtoER(parsedEdges);



})


/* function convertAFtoER(Initial, Edges, Nodes) {

    let ERString = "(";
    let simplifiedEdges = []

    // Simplifica o conjunto de arestas que tem mesma origem e destino
    Edges.forEach((edge, index) => {
        let simplifiedAdd = true;
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedAdd = false;
            }
        })
        if (simplifiedAdd) {
            simplifiedEdges.push({
                source: edge.source,
                target: edge.target,
                labels: []
            })
        }
    })

    // Adiciona os valores aceitos para cada conexão
    Edges.forEach((edge, index) => {
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedEdges[sIndex].labels.push(edge.label)
            }
        })
    })
    console.log(simplifiedEdges)


    simplifiedEdges.forEach((sEdge, sIndex) => {
        if (sEdge.labels.length > 1) {
            ERString = ERString.insert(ERString.length, "(");
            sEdge.labels.forEach((label, index) => {
                if (index == sEdge.labels.length - 1) {
                    ERString = ERString.insert(ERString.length, label);
                } else {
                    ERString = ERString.insert(ERString.length, label[index] + "|");
                }
            })
            ERString = ERString.insert(ERString.length, ")");
        } else {
            ERString = ERString.insert(ERString.length, sEdge.labels[0]);
        }
        if (sEdge.source == sEdge.target) {
            ERString = ERString.insert(ERString.length, "*")
        }
    })
    ERString = ERString.insert(ERString.length, ")");
    console.log(ERString);
} */


/* function convertAFtoER(Edges) {

    let ERString = "(";
    let simplifiedEdges = []

    // Simplifica o conjunto de arestas que tem mesma origem e destino
    Edges.forEach((edge, index) => {
        let simplifiedAdd = true;
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedAdd = false;
            }
        })
        if (simplifiedAdd) {
            simplifiedEdges.push({
                source: edge.source,
                target: edge.target,
                initial: edge.initial,
                final: edge.final,
                labels: []
            })
        }
    })

    // Adiciona os valores aceitos para cada conexão
    Edges.forEach((edge, index) => {
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedEdges[sIndex].labels.push(edge.label)
            }
        })
    })

    //Prepara links
    simplifiedEdges.forEach((sEdge, sIndex) => {
        sEdge.targets = [];
    })

    let cloneEdges = JSON.parse(JSON.stringify(simplifiedEdges));

    console.log(cloneEdges);



    simplifiedEdges.forEach((sEdge, sIndex) => {
        cloneEdges.forEach((cEdge, cIndex) => {
            if (sEdge.initial && cEdge.final && cEdge.source == sEdge.target)
                sEdge.targets.push(cEdge);
        })
    })

    console.log(simplifiedEdges);
    deepSearch(simplifiedEdges);



    function deepSearch(Edges, dIndex) {
        if (Array.isArray(Edges)) {
            Edges.forEach((sEdge, sIndex) => {
                if (sEdge.initial == true) {
                    ERString = ERString.insert(ERString.length, "(");
                    sEdge.labels.forEach((label, index) => {
                        if (index == sEdge.labels.length - 1) {
                            ERString = ERString.insert(ERString.length, label);
                        } else {
                            ERString = ERString.insert(ERString.length, label[index] + "|");
                        }
                    })
                    ERString = ERString.insert(ERString.length, ")");
                    if (sEdge.source == sEdge.target) {
                        ERString = ERString.insert(ERString.length, "*")
                    }

                    if (sEdge.final == true && sEdge.targets.length == 0)
                        ERString = ERString.insert(ERString.length, "|");

                    if (sEdge.targets.length > 0) {
                        ERString = ERString.insert(ERString.length, "(");
                        deeperSearch(sEdge.targets)
                    }
                }
            })
        }
    }

    function deeperSearch(Edges, index) {
        if (Array.isArray(Edges)) {
            Edges.forEach((sEdge, sIndex) => {
                ERString = ERString.insert(ERString.length, "(");
                sEdge.labels.forEach((label, index) => {
                    if (index == sEdge.labels.length - 1) {
                        ERString = ERString.insert(ERString.length, label);
                    } else {
                        ERString = ERString.insert(ERString.length, label[index] + "|");
                    }
                })
                ERString = ERString.insert(ERString.length, ")");

                if (sEdge.source == sEdge.target) {
                    ERString = ERString.insert(ERString.length, "*")
                }

                ERString = ERString.insert(ERString.length, ")|");
                deeperSearch(sEdge.targets)

            })
        }
    }

    if (ERString[ERString.length - 1] == "|")
        ERString = ERString.slice(0, ERString.length - 1);
    ERString = ERString.insert(ERString.length, ")");
    console.log(ERString);

    $("#RegexGrammar").val(ERString);
} */