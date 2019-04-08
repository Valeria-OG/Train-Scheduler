// Initialize Firebase
var config = {
  apiKey: "AIzaSyCooRoN-Ozn5obCWCLlAYCgPsB1c0RlmLY",
  authDomain: "bootcamp-3db3f.firebaseapp.com",
  databaseURL: "https://bootcamp-3db3f.firebaseio.com",
  projectId: "bootcamp-3db3f",
  storageBucket: "bootcamp-3db3f.appspot.com",
  messagingSenderId: "183115299819"
};
firebase.initializeApp(config);

var database = firebase.database();


// Disable form submissions if there are invalid fields
(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Get the forms we want to add validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

$("#submit").on("click", function (event) {
  event.preventDefault();
  var trainName = $("#trainname").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var firstTrainTime = $("#firsttraintime").val().trim();

  database.ref("addTrain").push({
    TrainName: trainName,
    Destination: destination,
    Frequency: frequency,
    FirstTrainTime: firstTrainTime,
  });

});


database.ref("addTrain").on("child_added", function (snapshot) {
  console.log("TrainName: " + snapshot.val().TrainName);
  console.log("Train Destination: " + snapshot.val().Destination);
  console.log("Frequency: " + snapshot.val().Frequency);
  console.log("First Train Time: " + snapshot.val().FirstTrainTime);
  var firstTimeConverted = moment(snapshot.val().FirstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  var currentTime = moment();
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difftime: " + diffTime);
  // Time apart (remainder)
  var tRemainder = diffTime % (snapshot.val().Frequency);
  console.log(tRemainder);
  // Minute Until Train
  var minutesAway = (snapshot.val().Frequency) - tRemainder;
  console.log("Minutes Away: " + minutesAway);
  // Next Train
  var nextTrain = moment().add(minutesAway, "minutes");

  var tableRow = $("<tr>");
  var trainNamet = $("<td>");
  var destinationt = $("<td> ");
  var frequencyt = $("<td> ");
  var nextArrivalt = $("<td>");
  var minutesAwayt = $("<td> ");

  trainNamet.append(snapshot.val().TrainName);
  destinationt.append(snapshot.val().Destination);
  frequencyt.append(snapshot.val().Frequency);
  minutesAwayt.append(minutesAway);
  nextArrivalt.append(moment(nextTrain).format("HH:mm"));

  tableRow.append(trainNamet);
  tableRow.append(destinationt);
  tableRow.append(frequencyt);
  tableRow.append(nextArrivalt);
  tableRow.append(minutesAwayt);

  $("tbody").append(tableRow);
});


