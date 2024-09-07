const searchBar = document.getElementById("searchBar");

const outputbox = document.getElementById("list");

var newElement =
  '<div style="height: 50px; width: 50px;background-color=#ff0;"></div>';

searchBar.addEventListener("keyup", function(e) {
  e.preventDefault();
  if (e.code == "Enter") console.log(searchBar.value);
  outputbox.innerHTML = newElement;
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
