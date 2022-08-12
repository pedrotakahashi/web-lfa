function addInput() {
    counter_multiple_inputs++;
    counter_multiple_outputs++;
    
    let input = document.getElementById('modal-div-strings').innerHTML = `<div class="input-group mb-3">
    <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-default">Gramática</span>
    </div>
    <input type="text" class="form-control" id="${counter_multiple_inputs}" aria-label="Default" aria-describedby="inputGroup-sizing-default">
</div>`;
    let paragraph = document.getElementById('modal-div-paragraph').innerHTML = `<p id="multiple-result-regex${counter_multiple_outputs}"></p>`;

}