function setVisible(item_id, value){
  let item = document.getElementById(item_id);
  switch (value){
    case true:
      item.style = "display: block;" 
    break;
    case false:
      item.style = "display: none;" 
    break;
    default:
      item.style = "display: "+value+";";
  }
}

function loadHTMLFrom(nodeId, pageURL, scriptURL){
	if(!pageURL)
		return;
  	//document.getElementById("content").innerHTML='<object style="height:100%; padding:0px; padding-top:10px;" class="container-fluid" type="text/html" data="'+pageURL+'.html" ></object>'
	var xhr = new XMLHttpRequest();
	xhr.open("GET", pageURL+".html", true);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var parser = new DOMParser();		
			var htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
	        document.getElementById(nodeId).innerHTML = htmlDoc.getElementsByTagName("div")[0].innerHTML;			
	        loadJSFrom(scriptURL);
		}
	}
	xhr.send(null);
}

function loadJSFrom(scriptURL){	
	if(!scriptURL)
		return;

	// Create new script element
	const script = document.createElement('script');
	script.src = scriptURL+'.js';

	// Append to the `head` element
	document.head.appendChild(script);
}

$(document).ready(function() {
	$(".navbar-nav .nav-link").on("click", function(){
	   $(".navbar-nav").find(".active").removeClass("active");
	   $(this).addClass("active");
	});
});

$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

var queryTab = document.getElementById("tab_query");
var quizTab = document.getElementById("tab_quiz");
var userTab = document.getElementById("tab_user");
var accountTab = document.getElementById("tab_account");
const projectSelector = document.getElementById("project_selector");
var projectId = null;

function addProject(value, index, array){
  let option = document.createElement("option");
  option.value = index;  
  option.innerHTML = value.name;
  projectSelector.appendChild(option);	
}

function updateProjectSelector(){  
	account = JSON.parse(localStorage.getItem("Account"));
	if(account.projects.length > 0){
		account.projects.forEach(addProject);
		if(account.projects.length > 1)
			projectId = 0;

		setVisible("project_selector", true);
	}
	if(account.accountType === "user"){
		setVisible("site_manager", true);
		setVisible("administrator_manager", true);
	}
}
updateProjectSelector();

function getProjectId(){
  index = document.getElementById("project_selector").value;
  if(index == ""){
  	return;
  }
  return account.projects[index].id;
}

function getProjectIndex(){
  index = document.getElementById("project_selector").value;
  if(index == ""){
  	return;
  }	
  return index;
}

window.onload = function() {
	loadHTMLFrom('html-content', '../data_importer/index', '../data_importer/data_import');	
	if(account.is_super_user){
		setVisible("researcher_manager", true);
		setVisible("project_manager", true);
	}
};

var project;
function retrieveProjectData(){
  $.ajax({
    url: serverURL + "/projects/" + getProjectId(),
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        project = data;
      } else {
        window.alert("couldn't add administrator");
      }
    }
  });
}
retrieveProjectData();

document.getElementById("project_selector").addEventListener('change', (event) => {
  retrieveProjectData();
});