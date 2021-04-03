var cardContent = document.getElementById("card-content");
var modalContent = document.getElementById("modalBody");

var dtable = new DataTable("Assessements", cardContent, false);

function addWeeklyReport(){
  dtable.draw(modalContent);
  console.log(modalContent);
}