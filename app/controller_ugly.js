// makes sure application isn't broken
$(document).ready(function() {

  // global variables
  var host = 'localhost';
  var sel_features = [];
  var sel_target = []; // only one item

  function init() {
    setupListeners();
  }

  function process(response) {
    console.log(response);
  }

  // add response to sel_features
  function selectFeature(response) {
    sel_features.push(response);
    console.log("Selected " + response + " as Feature!");
  }

  // assign sel_target to response
  function selectTarget(response) {
    sel_target.push(response);
    console.log("Selected " + response + " as Target!");
  }

  // for generating interface after selecting dataset
  function displayData(response) {
    column_names = response.column_names;
    num_columns = column_names.length;
    first_rows = response.first_rows;
    all_rows = first_rows;
    num_rows = 6;
    all_rows.unshift(column_names);

    table = document.getElementById("OverviewTable");

    // insert preview label
    var label = document.createElement("label");
    label.innerHTML = "Preview of Dataset:";
    document.getElementById("PreviewDiv").appendChild(label);

    // insert header row
    var row = table.insertRow(-1);
    for (var c = 0; c < num_columns; c++) {
        var header = document.createElement("TH");
        header.innerHTML = all_rows[0][c];
        row.appendChild(header);
    }

    // insert data rows
    for (var r = 1; r < num_rows; r++) {
        row = table.insertRow(-1);
        for (var c = 0; c < num_columns; c++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = all_rows[r][c];
        }
    }

    // create feature choices
    for (var c = 0; c < num_columns; c++) {
      var button = document.createElement("button");
      button.id = "attributeF" + c;
      button.innerHTML = all_rows[0][c];
      document.getElementById("FeaturesDiv").appendChild(button);
      listenFeature("attributeF" + c);
    }

    // create choose features button
    var chooseButtonX = document.createElement("button");
    chooseButtonX.id = "chooseButtonX";
    chooseButtonX.className = 'btn btn-primary btn-x1';
    chooseButtonX.innerHTML = "Choose Features";
    document.getElementById("FeaturesDiv").appendChild(chooseButtonX);
    setupListeners(listener="chooseButtonX");
  }

  // for generating interface after selecting features
  function processFeatures(response) {
    // create target choices
    for (var c = 0; c < num_columns; c++) {
      if (sel_features.indexOf(all_rows[0][c]) == -1) {
        var button = document.createElement("button");
        button.id = "attributeT" + c;
        button.innerHTML = all_rows[0][c];
        document.getElementById("TargetDiv").appendChild(button);
        listenTarget("attributeT" + c);
      }
    }

    // create choose target button
    var chooseButtonY = document.createElement("button");
    chooseButtonY.id = "chooseButtonY";
    chooseButtonY.className = 'btn btn-primary btn-x1';
    chooseButtonY.innerHTML = "Choose Target";
    document.getElementById("TargetDiv").appendChild(chooseButtonY);
    setupListeners(listener="chooseButtonY");
  }

  // wrapper for feature selection setupListeners
  function listenFeature(id) {
    var featureChoice = document.getElementById(id);
    if (typeof window.addEventListener==='function') {
      featureChoice.addEventListener ("click", function() {
        selectFeature(featureChoice.innerHTML) });
    }
  }

  // wrapper for target selection setupListeners
  function listenTarget(id) {
    var targetChoice = document.getElementById(id);
    if (typeof window.addEventListener==='function') {
      targetChoice.addEventListener ("click", function() {
        selectTarget(targetChoice.innerHTML) });
    }
  }

  function setupListeners(listener="") {
    // condition for init
    if (listener == "") {
      // listener for iris selection
      $( "#SelectIris" ).click( function( event ) {
        console.log("FRONT: Clicked on Iris");
        $.ajax({
          url: 'http://' + host + ':5000/',
          type: 'POST',
          data: JSON.stringify({
            name: "Selected Iris",
            phase: 1,
            fname: "iris",
            file: "../data/iris.csv"
            }),
          contentType: 'application/json',
          dataType: 'json',
        }).done((response) => { displayData(response) } );
      } );

      // listener for file selection
      $( 'input[type=file]' ).change(function () {
        var fileName = this.files[0].name;
        console.log("FRONT: Clicked on Select and Chose " + fileName);
        $.ajax({
          url: 'http://' + host + ':5000/',
          type: 'POST',
          data: JSON.stringify({
            name: "Selected Own Data",
            phase: 1,
            file: fileName,
            }),
          contentType: 'application/json',
          dataType: 'json',
        }).done((response) => { displayData(response) } );
      } );
    }

    // condition for selecting features
    if (listener == "chooseButtonX") {
      $( "#chooseButtonX" ).click( function( event ) {
        console.log("Chose Features!");
        //var features = document.getElementById("FeaturesText");
        //var target = document.getElementById("TargetText");
        $.ajax({
          url: 'http://' + host + ':5000/',
          type: 'POST',
          data: JSON.stringify({
            name: "Chose Features",
            phase: 2,
            features: sel_features
            }),
          contentType: 'application/json',
          dataType: 'json',
        }).done((response) => { processFeatures(response) } );
      } );
    }

    // condition for selecting features
    if (listener == "chooseButtonY") {
      $( "#chooseButtonY" ).click( function( event ) {
        console.log("Chose Target!");
        $.ajax({
          url: 'http://' + host + ':5000/',
          type: 'POST',
          data: JSON.stringify({
            name: "Chose Target",
            phase: 2,
            target: sel_target
            }),
          contentType: 'application/json',
          dataType: 'json',
        }).done((response) => { processTarget(response) } );
      } );
    }

    // next listener here

  }

  console.log("Starting App...");
  init();

});