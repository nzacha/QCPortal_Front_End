var cardContent = document.getElementById("card-content");
var modalContent = document.getElementById("modalBody");

var dtable = new DataTable("Assessements", cardContent, true);

function addWeeklyReport(){
	if(isFormComplete() && confirm("Do you want to complete the form submission?")){
			sendFormData(dtable);
	}
}

document.getElementById("week-label").innerHTML = "Week: "+project.week;
