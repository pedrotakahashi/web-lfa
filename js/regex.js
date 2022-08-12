// Variáveis globais
var counter_multiple_inputs = 0;
var tem_parenteses;
var groups = new Array();

$(document).ready(function () {
  $("#RegexString").keyup(function () {
    Regexinator();
  });
  $("#RegexGrammar").keyup(function () {
    Regexinator();
  });
});

// JQuery perguntando se deseja sair, mesmo com coisas não salvas
$(document).ready(function () {
  var form = $("#regex-form"),
    original = form.serialize();

  form.submit(function () {
    window.onbeforeunload = null;
  });

  window.onbeforeunload = function () {
    if (form.serialize() != original) return "Are you sure you want to leave?";
  };
});

function Regexinator() {
  let local_groups = new Array();
  let parenteses = "()";

  let str = $("#RegexString").val();
  let patt = $("#RegexGrammar").val();

  let result;
  let title = "Resultado -";

  if (patt == "" || patt == null || patt == undefined) {
    document.getElementById("result-regex").innerHTML =
      "Gramática não inserida, não pode analizar null";
    $("#RegexString").css("background-color", "#fff");
  } else if ((result = str.match(patt))) {
    result = "A entrada " + str + " corresponde a expressão";
    $("#result-regex-title").html(title);
    $("#result-regex").html(result);
    $("#RegexString").css("background-color", "#17ff4d66");
  } else {
    result = "A entrada NÃO corresponde a expressão";
    document.getElementById("result-regex-title").innerHTML = title;
    document.getElementById("result-regex").innerHTML = result;
    $("#RegexString").css("background-color", "rgba(255, 23, 23, 0.4)");
  }
}
function adicionarInput() {
  counter_multiple_inputs += 1;
  console.log(counter_multiple_inputs);
  $("#modal-new-input").append(`
    <div class="input-group mb-3">
            <div class="input-group-prepend">
            <span class="input-group-text no-select" id="inputGroup-sizing-default">Entrada ${counter_multiple_inputs} </span>
        </div>
        <input type="text" class="form-control" id="RegexString${counter_multiple_inputs}" aria-label="Default"
            aria-describedby="inputGroup-sizing-default">
    </div>
    `);
}

function multipleRegexinator() {
  let local_groups = new Array();
  let parenteses = "()";

  let str = new Array();

  for (let i = 1; i <= counter_multiple_inputs; i++) {
    str[i] = document.getElementById("RegexString" + i).value;
  }

  let patt = document.getElementById("RegexGrammarModal").value;
  // let patt = /patt1/i;
  let auxiliar_patt = "Gramática: " + patt;
  let result;

  if (patt == "" || patt == null || patt == undefined) {
    document.getElementById("multiple-regex-grammar").innerHTML =
      "Gramática não inserida, não pode analizar null";
  } else {
    for (let j = 1; j <= counter_multiple_inputs; j++) {
      if (patt == "" || str == "") {
      } else if ((result = str[j].match(patt))) {
        $("#RegexString" + j).html(result);
        $("#RegexString" + j).css("background-color", "#17ff4d66");
      } else {
        $("#RegexString" + j).html(result);
        $("#RegexString" + j).css("background-color", "rgba(255, 23, 23, 0.4)");
      }
    }
  }
}
