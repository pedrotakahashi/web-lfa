let parsedEdges = [];
let reduce = [];
let alfabeto = [];

$('#buttonModalAFNDAFD').click(function () {
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

    cy.nodes().forEach(function (node, index) {
        reduce.push({
            nodo: node.data().label,
            initial: node.data().initial,
            final: node.data().final,

        });
    });

    
    parsedEdges.forEach(function (edge, index1) {
        let add = true;
        alfabeto.forEach(function (letra, index2) {
            if (letra == edge.label)
                add = false;
        });
        if (add == true)
            alfabeto.push(edge.label);
    });

    reduce.forEach(function (elem, index1) {
        alfabeto.forEach(function (letra, index2) {
            elem[`${letra}`] = [];
        });
    });

    reduce.forEach(function (node, index1) {
        parsedEdges.forEach(function (edge, index2) {
            if (node.nodo == edge.source) {
                alfabeto.forEach(function (char, index3) {
                    if (edge.label == char) {
                        node[`${char}`].push(edge.target);
                    }
                });
            }
        });
    });


    $("#tabelaConversao thead tr").append(`<th>TRANSIÇÕES</th>`)
    alfabeto.forEach(function (letra, index) {
        $("#tabelaConversao thead tr").append(`<th>${letra}</th>`)
    });


    reduce.forEach(function (node, index1) {
        $("#tabelaConversao tbody").append(`
        <tr id="nodo${node.nodo}">
            <td>${node.nodo}</td> 
        </tr>`)
    });

    $(`#nodoNulo`).append(`
        <td>ø</td> 
    `)

    alfabeto.forEach((elemento) => {
        $(`#nodoNulo`).append(`
            <td>ø</td> 
        `)
    })

    reduce.forEach(function (node, index1) {
        alfabeto.forEach((elemento) => {
            $(`#nodo${node.nodo}`).append(`
                <td id="ref${elemento}"></td> 
            `)
        })
    });


    reduce.forEach(function (node, index1) {
        alfabeto.forEach((elemento) => {
            node[`${elemento}`].forEach((transicao) => {
                $(`#nodo${node.nodo} #ref${elemento}`).append(`
                ${transicao}, 
            `)
            })
        })
    });


    alfabeto.forEach((elemento, index) => {
        $("#alfabeto").append(elemento + ", ")
    })
    $("#alfabeto").append("}")

    cy.remove(cy.elements());

    console.log("Objeto reduce : " + reduce);

    let edgeCount = parsedEdges.length;
    let statesCount = reduce.length;

    let x = 0;
    let y = 0;

    console.log("Edges count: " + edgeCount);
    console.log("States count: " + statesCount);
    let tNodes = [];
    let id = 0;

    reduce.forEach((elemento, index) => {
        cy.add([{
            data: { label: elemento.nodo, initial: elemento.initial, final: elemento.final, link: [] },
            renderedPosition: {
                x: x,
                y: y,
            },
        }]);

        tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: id })

        x = x + 45;
        y = y + 37;
        id = id + 1;

        styleNode(cy.nodes()[cy.nodes().length - 1], '#' + cy.nodes()[cy.nodes().length - 1].data().id)
    });

    /*Adicionando as ligações entre os nodes abaixo*/
    reduce.forEach((node, index) => {
        alfabeto.forEach((elemento, index) => {
            node[`${elemento}`].forEach((transicao, index) => {
                cy.add([{
                    group: 'edges', data: { source: cy.elements(`node[label = '${node.nodo}']`).data().id, target: cy.elements(`node[label = '${transicao}']`).data().id, label: elemento }
                }]);
            })
        });
    });

    // Centralizando o automato e ligando as referencias com os ids.
    getReverseReferenceId('', tNodes);
    cy.center()

})  