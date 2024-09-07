const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("keyup", function(e) {
  e.preventDefault();
  console.log(e);
});

data = [
  {
    rollStart: [24, "MA", 10041],
    rollEnd: [24, "MA", 10066],
    roomNumber: "NR112",
    seatingArrangement: "A",
    subjectCode: "MA11007",
    subjectName: "Single Variable Calculus",
    examTime: "2:00 pm-4:00pm",
    examDate: "TUESDAY 10th Septemper ",
  },
];
