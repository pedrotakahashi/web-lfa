//Variaveis globais
let myfiles;

$('#export-grammar').click(function (){
    let XML = "";
    let XML_end = `
</structure>
`;
    let left_production = "";
    let right_production = "";
    let today = new Date();
    let file_name = `Gramatica_${today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + '_' + today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds()}.jff`;

    XML += `<?xml version="1.0" encoding="UTF-8" standalone="no"?><!--Created with JFLAP 7.1.--><structure>&#13;
    <type>grammar</type>&#13;
    <!--The list of productions.-->&#13;`;
    
    for (let i = 0; i < table_count; i++) {
        left_production = $(`#Token${i}`).text();
        right_production = $(`#Grammar${i}`).text();
        XML +=`
    <production>&#13;`;
        XML += `
        <left>`+left_production+`</left>&#13;
        <right>`+right_production+`</right>&#13;`;
        XML +=`
    </production>&#13;`;
    }
    XML += XML_end;
    //console.log(XML);
    
    let FileSaver = saveAs(new Blob(
        [XML]
        ,{type: "application/xml;charset=uft-8"}
        )
        ,file_name
    );
    
    FileSaver;

});

$('#import-grammar').click(function () {
    let contents;
    let contentsOBJ;
    $('<input type="file">').on('change', function () {
        myfiles = this.files; //save selected files to the array
        //console.log(myfiles); //show them on console
        let reader = new FileReader();
        reader.onload = function (e) {
            contents = e.target.result.toString();
            //console.log(contents);
            contents = contents.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '<xml version="1.0" encoding="UTF-8" standalone="no">');
            contents += '</xml>'
            contentsOBJ = xmlToJson.parse(contents)
            //console.log(contentsOBJ);
            if(contentsOBJ.xml.structure.type == "grammar") {
                importToTable(contentsOBJ);
            } else {
                alert("O tipo de arquivo está incorreto, tente um arquivo do tipo gramática");
            }
        }
        reader.readAsText(myfiles[0]);

    }).click();
});

function importToTable(parsedObject){
    let i = 0;
    parsedObject.xml.structure.production.forEach(element => {
        addTable();
        if(typeof element.right !== "string") {
            $(`#Token${i}`).text(element.left);
            $(`#Grammar${i}`).text("λ");
        } else {
            $(`#Token${i}`).text(element.left);
            $(`#Grammar${i}`).text(element.right);
        }
        i++;
    });
}