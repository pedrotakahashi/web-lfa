/* CYTOSCAPE */
var cy = cytoscape({
  container: $('#mynetwork'),
  elements: [],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#fcba03',
        'background-color': '#fcd303',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },

    {
      selector: '.initialnode',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#fcba03',
        'background-color': '#ffffff',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },
    {
      selector: '.finalnode',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#ca59ff',
        'background-color': '#fcd303',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },
    {
      selector: '.bothnode',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#ca59ff',
        'background-color': '#ffffff',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#2e2e2e',
        'curve-style': 'bezier',
        'target-arrow-color': '#2e2e2e',
        'target-arrow-shape': 'triangle',
        'text-margin-y': -10,
        'label': 'data(label)'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }
});

/* VARIÁVEIS */
let modoEdicao;
var counter_multiple_inputs = 0;

/* INICIALIZAÇÃO */
$(document).ready(function () {
  $('#manipular').click();
  //console.log(cy.nodes());
});

/* MENUS */
$('#editor a').on('click', function (e) {
  $(this).parent().find('a.active').removeClass('active');
  $(this).addClass('active');
  modoEdicao = $(this).attr("id");
  ////console.log(modoEdicao);
  if (modoEdicao == 'aresta') {
    cy.nodes().ungrabify();
  } else {
    cy.nodes().grabify();
  }
});


/* EVENTOS */
/* Adicionar Nó */
cy.on('tap', function (event) {
  if (modoEdicao == "adicionar") {
    cy.add([{
      data: { label: `q${cy.nodes().length}`, initial: false, final: false, link: [] },
      renderedPosition: {
        x: event.renderedPosition.x,
        y: event.renderedPosition.y,
      },
    }]);
  } else {
    $(".custom-menu").slideUp(100);
  }
});

/* Remover e Editar Nó */
cy.on('tap', 'node', function (event) {
  var node = cy.$('#' + event.target.id());
  if (modoEdicao == "excluir") {
    cy.remove(node);
    console.log(node.removed())
  } else if (modoEdicao == "editar") {
    let name = prompt("Digite o valor a ser atualizado:");
    if (name !== null) {
      if (name == "") {
        name = "λ"
      }
      else {
        name = name;
      }
      node.data().label = name;
    }
  } else {
    //console.log(event.renderedPosition.x, event.renderedPosition.y)
    event.preventDefault();
    $(".custom-menu").finish().toggle(100);
    $(".custom-menu").css({
      left: event.renderedPosition.x + "px",
      top: event.renderedPosition.y + "px"
    });
    $(".custom-menu").data("nodo", { id: event.target.id() });
    //console.log("Data: " + $(".custom-menu").data("nodo").id);
    if (node.data().initial) {
      $("#inicial").text("Inicial ✓");
    } else {
      $("#inicial").text("Inicial");
    }

    if (node.data().final) {
      $("#final").text("Final ✓");
    } else {
      $("#final").text("Final");
    }
  }
});

/* Adicionar Aresta */
let firstNode, secondNode;
cy.on('mousedown', 'node', function (event) {
  event.stopPropagation()
  firstNode = cy.$('#' + event.target.id());
}).on('mouseup', 'node', function (event) {
  event.stopPropagation()
  if (modoEdicao == "aresta") {
    secondNode = cy.$('#' + event.target.id());
    let name = prompt("Digite o valor da transição");
    if (name !== null) {
      if (name == "") {
        name = "λ"
      }
      else {
        name = name;
      }

      cy.add([{
        group: 'edges', data: { source: firstNode.data().id, target: secondNode.data().id, label: name }
      }]);
    }
  }
});


/* Remover e Editar Aresta */
cy.on('tap', 'edge', function (event) {
  var edge = cy.$('#' + event.target.id());
  if (modoEdicao == "excluir") {
    cy.remove(edge);
  } else if (modoEdicao == "editar") {
    let name = prompt("Digite o valor a ser atualizado:");
    if (name !== null) {
      if (name == "") {
        name = "λ"
      }
      else {
        name = name;
      }
      edge.data().label = name;
    }
  }
});

$("#inicial").on("click", function (event) {
  var node = cy.$('#' + $(".custom-menu").data("nodo").id);
  if (!node.data().initial) {

    let initialNodesWBoth = cy.filter('.bothnode');
    let initialNodes = cy.filter('.initialnode');
    if (initialNodesWBoth.data() != undefined) {
      initialNodesWBoth.data().initial = false;
      styleNode(initialNodesWBoth, '#' + initialNodesWBoth.data().id);
    }
    if (initialNodes.data() != undefined) {
      initialNodes.data().initial = false;
      styleNode(initialNodes, '#' + initialNodes.data().id);
    }


    node.data().initial = true;
    $("#inicial").text("Inicial ✓");


  } else {
    node.data().initial = false;
    $("#inicial").text("Inicial");
  }
  styleNode(node, '#' + $(".custom-menu").data("nodo").id)
})

$("#final").on("click", function (event) {
  var node = cy.$('#' + $(".custom-menu").data("nodo").id);
  if (!node.data().final) {
    node.data().final = true;
    $("#final").text("Final ✓");
  } else {
    node.data().final = false;
    $("#final").text("Final");
  }
  styleNode(node, '#' + $(".custom-menu").data("nodo").id)
})

function styleNode(ref, node) {
  if (ref.data().final && ref.data().initial) {
    cy.$(node).classes('bothnode');
  } else if (!ref.data().final && !ref.data().initial) {
    cy.$(node).classes('node');
  } else if (ref.data().final) {
    cy.$(node).classes('finalnode');
  } else if (ref.data().initial) {
    cy.$(node).classes('initialnode');
  }
}

function adicionarInput() {
  counter_multiple_inputs += 1;
  $('.modal-div-strings').append(`
    
    <div class="input-group mb-3">
            <div class="input-group-prepend">
            <span class="input-group-text no-select" id="inputGroup-sizing-default">Entrada ${counter_multiple_inputs} </span>
        </div>
        <input type="text" class="form-control" id="EntradaAutomatos${counter_multiple_inputs}" aria-label="Default"
            aria-describedby="inputGroup-sizing-default" style="width: 80%;">
    </div>
    `);
}

/* LÓGICA */
$("#verificarSingle").click(function () {
  let entrada = $("#single-entrada").val();
  let inicial;
  if (entrada != "" && entrada != null) {
    ////console.log(entrada);
    cy.nodes().forEach(function (ele) { // Your function call inside
      ////console.log("loop", ele.data(), ele.data().initial);
      if (ele.data().initial)
        inicial = ele;
    });

    ////console.log(inicial);
    let result = resultAutomato(entrada, inicial, 0)
    if (result) {
      $(`#single-entrada`).css('background-color', '#17ff4d66');
    } else {
      $(`#single-entrada`).css('background-color', 'rgba(255, 23, 23, 0.4)');
    }

  }
})

$("#verificarMultiple").click(function () {
  let entrada = new Array();

  for (let i = 1; i <= counter_multiple_inputs; i++) {
    entrada[i] = $(`#EntradaAutomatos${i}`).val();
    console.log(entrada[i]);
  }

  let inicial;
  let result;

  cy.nodes().forEach(function (ele) { // Your function call inside
    ////console.log("loop", ele.data(), ele.data().initial);
    if (ele.data().initial)
      inicial = ele;
  });

  for (let j = 1; j <= entrada.length; j++) {

    if (entrada[j] != "" && entrada[j] != null) {
      ////console.log(inicial);
      result = resultAutomato(entrada[j], inicial, 0);
      if (result) {
        $(`#EntradaAutomatos${j}`).css('background-color', '#17ff4d66');
      } else {
        $(`#EntradaAutomatos${j}`).css('background-color', 'rgba(255, 23, 23, 0.4)');
      }

      //$("#resultadoSingle").text(resultAutomato(entrada, inicial, 0));
    }
  }

})

function resultAutomato(entrada, node, indice) {
  let result = false;
  let nodes = cy.nodes();
  let edges = cy.edges();
  let connections = node.connectedEdges();
  let results = [];
  
  console.log("Conexoes", Object.keys(connections).length, connections);
  for (let i = 0; i < connections.length; i++) {
    if (connections[i] !== undefined) {
      if (connections[i].data().label == entrada[indice] && connections[i].data().source == node.data().id) {
        console.log(entrada[indice]);
        console.log("Verificando edge: ", connections[i].data(),node.data().id );
        if (cy.getElementById(connections[i].data().target).data().final == true && indice == entrada.length - 1) {
          console.log("\tSubif 1");
          results.push(true);
        } else if (indice <= entrada.length - 1) {
          results.push(resultAutomato(entrada, cy.getElementById(connections[i].data().target), indice += 1))
          console.log("\tSubif 2");
        }else{
          console.log("\tSubif 3")
        }
      } else {
        results.push(false)
      }
    }else{
      results.push(false)
    }
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i] == true)
      return true
  }

  return false;
}

/* IMPORTAÇÃO */
function getReferenceId(id, tNodes){
  for(let i = 0; i < tNodes.length; i++ ){
    if(tNodes[i].nodeid == id){
      return tNodes[i].id;
    }
  }
}

$("#exportar").on("click", function (event) {
  let exportString;
  let tNodes = []
  exportString = 
  `<?xml version="1.0" encoding="UTF-8" standalone="no"?><!--Created with JFLAP 7.1.--><structure>&#13;
    <type>fa</type>&#13;
    <automaton>&#13;
    <!--The list of states.-->&#13;`;
  cy.nodes().forEach(function (ele, index) { 
    console.log( ele.data());
    tNodes.push({id: index, nodeid: ele.data().id})
    exportString += 
    `<state id="${index}" name="${ele.data().label}">&#13;
			<x>${ele.position('x')}</x>&#13;
      <y>${ele.position('y')}</y>&#13;
      ${ele.data().initial ? 
      `<initial/>&#13;` : ``}
      ${ele.data().final ? 
      `<final/>&#13;` : ``}
		</state>&#13; `
  });
  console.log(tNodes)
  exportString += 
  `<!--The list of transitions.-->&#13;`;
  cy.edges().forEach(function (ele, index) { 
    console.log( ele.data());
    exportString += 
    `<transition>&#13;
      <from>${getReferenceId(ele.data().source, tNodes)}</from>&#13;
      <to>${getReferenceId(ele.data().target, tNodes)}</to>&#13;
      <read>${ele.data().label}</read>&#13;
    </transition>&#13;`
  });

  exportString += 
  ` 
    </automaton>&#13;
  </structure>`
  console.log(exportString)
  var today = new Date();
  let FileSaver = saveAs(new Blob(
    [exportString]
    ,{type: "application/xml;charset=uft-8"}
    )
    ,`Automato_${today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + '_' + today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds()}.jff`);

FileSaver;
})

function getReverseReferenceId(id, tNodes){
  for(let i = 0; i < tNodes.length; i++ ){
    if(tNodes[i].id == id){
      return tNodes[i].nodeid;
    }
  }
}

function importAutomaton(automaton){
  let tNodes = [];
  cy.remove(cy.elements());
  automaton.state.forEach(function (node, index){
    //console.log(node);
    cy.add([{
      data: { label: node.name, initial: node.hasOwnProperty("initial") ? true : false, final: node.hasOwnProperty("final") ? true : false, link: [] },
      renderedPosition: {
        x: node.x,
        y: node.y,
      },
    }]);
    tNodes.push({nodeid: cy.nodes()[cy.nodes().length-1].data().id, id: node.id})
    styleNode(cy.nodes()[cy.nodes().length-1],  '#' + cy.nodes()[cy.nodes().length-1].data().id)
  })

  automaton.transition.forEach(function (edge, index){
    cy.add([{
      group: 'edges', data: { source: getReverseReferenceId(edge.from, tNodes), target: getReverseReferenceId(edge.to, tNodes), label: edge.read }
    }]);
  })
  getReverseReferenceId('', tNodes);
  cy.center()
}

$('#importar').click(function() {
  let contents;
  let parse;
  $('<input type="file">').on('change', function () {
      myfiles = this.files; //save selected files to the array
      //console.log(myfiles); //show them on console
      let reader =  new FileReader();
      reader.onload = function(e) {
          contents = e.target.result.toString();
          //console.log(contents);
          contents = contents.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '<xml version="1.0" encoding="UTF-8" standalone="no">');
          contents += '</xml>'
          parse = xmlToJson.parse(contents)
          console.log(parse);
          if(parse.xml.structure.type != "fa")
            alert("O arquivo importado deve ser do tipo Automato Finito");
          else
            importAutomaton(parse.xml.structure.automaton)
      }
      reader.readAsText(myfiles[0]);
  }).click();
});

// INICIO DA CONVERÇÃO GR PARA AF
$("#convertGRtoAF").click(function () {
  let production = [];
  let production_length = 0;
  cy.remove(cy.elements());
  for (let i = 0; i < table_count; i++) {

    if ($(`#Grammar${i}`).text().length < 2) {
      if (isLowerCase($(`#Grammar${i}`).text()) || $(`#Grammar${i}`).text() == "λ") {
        production.push(
          {
            left: $(`#Token${i}`).text(),
            terminal: $(`#Grammar${i}`).text()[0],
            variavel: "Z",
          }
        );
      } else {
        production.push(
          {
            left: $(`#Token${i}`).text(),
            variavel: $(`#Grammar${i}`).text()[0],
            terminal: "λ",
          }
        );
      }
    } else if ($(`#Grammar${i}`).text().length == 2) {
      production.push(
        {
          left: $(`#Token${i}`).text(),
          terminal: $(`#Grammar${i}`).text()[0],
          variavel: $(`#Grammar${i}`).text()[1],
        }
      );
    }

    production_length++;
  }

  //console.log(production);
  //console.log("tamanho do objeto production: "+production_length);

  // Chamando a função que vai realizar a maioria das coisas
  convertGrtoAF(production, production_length);
})

// Remover elementos repetitidos do vetor de criação de estados.
function getUnique(array) {
  var uniqueArray = [];

  // Loop through array values
  for (var value of array) {
    if (uniqueArray.indexOf(value) === -1) {
      uniqueArray.push(value);
    }
  }
  return uniqueArray;
}

// A função que realiza a conversão GR-AF
function convertGrtoAF(production, production_length) {
  let tNodes = []; // Vetor de cordenadas para o automato relizar a indentificação por ids
  let id = 0;      // ids para os automatos.

  // Cordenadas para botar os automatos na div.
  let x = 0;
  let y = 0;

  cy.remove(cy.elements());

  // Declarando o vetor para os objetos.
  let nodeTable = [];

  // Gerando uma vetor de objetos contendo a tabela de transição Gramática-Automato
  for (let i = 0; i < production_length; i++) {
    if (i == 0) {
      if (production[i].variavel === "Z") {
        nodeTable.push(
          {
            id: 0,
            origem: production[i].left,
            destino: production[i].variavel,
            label: production[i].left,
            initial: true,
            //final: true,
            terminal: production[i].terminal,
            temZ: true,
          }
        );

        /*
        nodeTable.push(
          {
            id: 0,
            origem: production[i].variavel,
            destino: "none",
            label: production[i].variavel,
            initial: true,
            //final: true,
            terminal: "none",
            temZ: true,
          }
        );
        */
      } else {
        nodeTable.push(
          {
            id: 0,
            origem: production[i].left,
            destino: production[i].variavel,
            label: production[i].left,
            initial: true,
            //final: false,
            terminal: production[i].terminal,
            temZ: false,
          }
        );
        id = id + 1;
      }

    } else {
      if (production[i].variavel === "Z") {
        nodeTable.push(
          {
            id: id,
            origem: production[i].left,
            destino: production[i].variavel,
            label: production[i].left,
            //initial: false,
            //final: false,
            terminal: production[i].terminal,
            temZ: true,
          }
        );

        /*
        nodeTable.push(
          {
            id: 0,
            origem: production[i].variavel,
            destino: "none",
            label: production[i].variavel,
            initial: true,
            //final: true,
            terminal: "none",
            temZ: true,
          }
        );
        */
       
      } else {
        nodeTable.push(
          {
            id: id,
            origem: production[i].left,
            destino: production[i].variavel,
            label: production[i].left,
            //initial: false,
            //final: false,
            terminal: production[i].terminal,
            temZ: false,
          }
        );
        
        // id para identificação das areas das tabelas, por mais que eu acabei não usando elas, deixei pq o código n funciona sem elas
        if ((production[i + 1] !== undefined ) && production[i].left != production[i + 1].left || production[i].variavel === "Z") {
          id = id + 1;
        }
      }
    }
  }

  // Tabela de conversão abaixo
  console.log("Tabela de converção:\n");
  console.log(nodeTable);

  let hasZNode = false; // Flag para botar o automato Z


  cy.add([{
    data: { label: `Z`, initial: false, final: true, link: [] },
    renderedPosition: {
      x: x,
      y: y,
    },
  }]);
  hasZNode = true;


  console.log("Label: " + "Z");
  console.log("Origem: " + "none");
  console.log("Destino: " + "none");
  console.log("Alfabeto: " + "none");


  tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: `Z` })
  styleNode(cy.nodes()[cy.nodes().length - 1], '#' + cy.nodes()[cy.nodes().length - 1].data().id)
  
  let aux_vetor = [];
  let count = 0;

  let flag = false;

  for (let i = 0; i < nodeTable.length; i++) {
    aux_vetor[i] = nodeTable[i].label;
  }

  aux_vetor = getUnique(aux_vetor);
  console.log(aux_vetor);

  for (let j = 0; j < nodeTable.length && flag != true; j++) {

    if (aux_vetor[count] == nodeTable[j].label) {
      cy.add([{
        data: { label: nodeTable[j].label, initial: nodeTable[j].hasOwnProperty("initial") ? true : false, final: nodeTable[j].hasOwnProperty("final") ? true : false, link: [] },
        renderedPosition: {
          x: x,
          y: y,
        },
      }]);


      console.log("Label: " + nodeTable[j].label);
      console.log("Origem: " + nodeTable[j].origem);
      console.log("Destino: " + nodeTable[j].destino);
      console.log("Alfabeto: " + nodeTable[j].terminal);


      tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: nodeTable[j].label })
      count++;
    }
    
    /*
    if ((nodeTable[j + 1] != undefined || nodeTable[j + 1] != null) && nodeTable[j].origem !== nodeTable[j + 1].origem) {
      cy.add([{
        data: { label: nodeTable[j].label, initial: nodeTable[j].hasOwnProperty("initial") ? true : false, final: nodeTable[j].hasOwnProperty("final") ? true : false, link: [] },
        renderedPosition: {
          x: x,
          y: y,
        },
      }]);


      console.log("Label: " + nodeTable[j].label);
      console.log("Origem: " + nodeTable[j].origem);
      console.log("Destino: " + nodeTable[j].destino);
      console.log("Alfabeto: " + nodeTable[j].terminal);


      tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: nodeTable[j].label })
    } else if (nodeTable[j + 1] === undefined || nodeTable[j + 1] === null) { //Quando for o ultimo objeto do vetor, adiciona o node com as infos.
      cy.add([{
        data: { label: nodeTable[j].label, initial: nodeTable[j].hasOwnProperty("initial") ? true : false, final: nodeTable[j].hasOwnProperty("final") ? true : false, link: [] },
        renderedPosition: {
          x: x,
          y: y,
        },
      }]);


      console.log("Label: " + nodeTable[j].label);
      console.log("Origem: " + nodeTable[j].origem);
      console.log("Destino: " + nodeTable[j].destino);
      console.log("Alfabeto: " + nodeTable[j].terminal);


      // Push das infos dos nodes e seus respectivos ids no vetor tNodes.
      tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: nodeTable[j].label })
    } */

    /*
    if (nodeTable[j].temZ === true && hasZNode === false) { // Se o automato Z não exister e chegar em um objeto com ele, cria um node chamado Z.
      cy.add([{
        data: { label: `Z`, initial: nodeTable[j].hasOwnProperty("initial") ? true : false, final: nodeTable[j].hasOwnProperty("final") ? true : false, link: [] },
        renderedPosition: {
          x: x,
          y: y,
        },
      }]);
      hasZNode = true;


      console.log("Label: " + nodeTable[j].label);
      console.log("Origem: " + nodeTable[j].origem);
      console.log("Destino: " + nodeTable[j].destino);
      console.log("Alfabeto: " + nodeTable[j].terminal);


      tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: `Z` })
    } 
    if ((nodeTable[j + 1] != undefined || nodeTable[j + 1] != null) && nodeTable[j].origem !== nodeTable[j+1].origem){ // Criando um node com as infos do objeto
      cy.add([{
        data: { label: nodeTable[j].label, initial: nodeTable[j].hasOwnProperty("initial") ? true : false, final: nodeTable[j].hasOwnProperty("final") ? true : false, link: [] },
        renderedPosition: {
          x: x,
          y: y,
        },
      }]);


      console.log("Label: " + nodeTable[j].label);
      console.log("Origem: " + nodeTable[j].origem);
      console.log("Destino: " + nodeTable[j].destino);
      console.log("Alfabeto: " + nodeTable[j].terminal);


      tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: nodeTable[j].label })
    } else if (nodeTable[j + 1] === undefined || nodeTable[j + 1] === null) { //Quando for o ultimo objeto do vetor, adiciona o node com as infos.
      cy.add([{
        data: { label: nodeTable[j].label, initial: nodeTable[j].hasOwnProperty("initial") ? true : false, final: nodeTable[j].hasOwnProperty("final") ? true : false, link: [] },
        renderedPosition: {
          x: x,
          y: y,
        },
      }]);


      console.log("Label: " + nodeTable[j].label);
      console.log("Origem: " + nodeTable[j].origem);
      console.log("Destino: " + nodeTable[j].destino);
      console.log("Alfabeto: " + nodeTable[j].terminal);


      // Push das infos dos nodes e seus respectivos ids no vetor tNodes.
      tNodes.push({ nodeid: cy.nodes()[cy.nodes().length - 1].data().id, id: nodeTable[j].label })
    }
    */
    // Cordenadas aleatorias para o automato ficar mais ou menos distante
    x = x + 45;
    y = y + 37;

    
    styleNode(cy.nodes()[cy.nodes().length - 1], '#' + cy.nodes()[cy.nodes().length - 1].data().id)
  }

  console.log(tNodes);

  /*Adicionando as ligações entre os nodes abaixo*/
  for (let w = 0; w < nodeTable.length; w++) {
    if(nodeTable[w].label !== "Z"){
      cy.add([{
        group: 'edges', data: { source: getReverseReferenceId(nodeTable[w].origem, tNodes), target: getReverseReferenceId(nodeTable[w].destino, tNodes), label: nodeTable[w].terminal }
      }]);
    }
  }

  // Centralizando o automato e ligando as referencias com os ids.
  getReverseReferenceId('', tNodes);
  cy.center()

}
// FIM DA CONVERÇÃO GR-AF


// INICIO DA CONVERÇÃO AF-GR
$('#convertAFtoGR').click(function () {
  let grammarOBJ = [];
  let automatonTableOBJ = [];
  let tNodes = [];
  let counter = 0;
  
  cy.nodes().forEach(function (ele, index) {
    console.log(ele.data());
    tNodes.push({ id: index, nodeid: ele.data().id });
    automatonTableOBJ.push(
      {
        id: ele.data().id,
        node: ele.data().label,
        terminal: "",
        origem: "",
        destino: "",
      }
    );
    counter++;
  })
  console.log(tNodes);
  let i = 0;
  
  cy.edges().forEach(function (ele, index) {
    console.log(ele.data());


    if( i < index){
      automatonTableOBJ[i].node = automatonTableOBJ[i].node;
      automatonTableOBJ[i].terminal = ele.data().label;
      automatonTableOBJ[i].origem = getReferenceId(ele.data().source, tNodes);
      automatonTableOBJ[i].destino = getReferenceId(ele.data().target, tNodes);
      i++;
    }
  
  });

  for( let j = 0; j < automatonTableOBJ.length; j++){
    if (automatonTableOBJ[j+1] !== undefined || automatonTableOBJ[j+1] !== null){
      grammarOBJ.push(
        {
          left: automatonTableOBJ[j].node,
          terminal: automatonTableOBJ[j].terminal,
          variavel: automatonTableOBJ[j].destino,
        }
      );
    }
  }

  console.log("Tabela de transição dos automatos:\n");
  console.log(automatonTableOBJ);
  console.log("Gramática gerada:\n");
  console.log(grammarOBJ);
});
// FIM DA CONVERÇÃO AF-GR