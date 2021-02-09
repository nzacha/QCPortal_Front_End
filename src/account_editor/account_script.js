var nameField = document.getElementById("name_input");
var surnameField = document.getElementById("surname_input");
var mobileField = document.getElementById("mobile_input");
var emailField = document.getElementById("email_input");
var passwordField = document.getElementById("password_input");
var descriptionField = document.getElementById("description_input");

var researcher;

var project_content = document.getElementById("project_content");

var study_length;
var tests_per_day;
var tests_time_interval;
var allow_individual_times;
var allow_user_termination;
var automatic_termination;

function loadResearcherInfo(){
	researcher = JSON.parse(localStorage.getItem("RESEARCHER"));
	nameField.placeholder = researcher.name;
	nameField.onfocus = function(){
	    if(!this.classList.contains("changed"))
	      this.classList.add("changed"); 
	    if(!this.value){
	      this.value = this.placeholder;
	    }
	};
	nameField.onblur = function(){
	    if(this.value == this.placeholder){
	      this.placeholder = this.value;
	      this.value = null;      
	      this.classList.remove("changed");
	    }
	};

	surnameField.placeholder = researcher.surname;
	surnameField.onfocus = function(){
	    if(!this.classList.contains("changed"))
	      this.classList.add("changed"); 
	    if(!this.value){
	      this.value = this.placeholder;
	    }
	};
	surnameField.onblur = function(){
	    if(this.value == this.placeholder){
	      this.placeholder = this.value;
	      this.value = null;      
	      this.classList.remove("changed");
	    }
	};

	if(researcher.phone)
		mobileField.placeholder = researcher.phone;	
	mobileField.onfocus = function(){
	    if(!this.classList.contains("changed"))
	      this.classList.add("changed"); 
	    if(!this.value){
	      this.value = this.placeholder;
	    }
	};
	mobileField.onblur = function(){
	    if(this.value == this.placeholder){
	      this.placeholder = this.value;
	      this.value = null;    
	      this.classList.remove("changed");  
	    }
	};

	emailField.placeholder = researcher.email;	
	emailField.onfocus = function(){
	    if(!this.classList.contains("changed"))
	      this.classList.add("changed"); 
	    if(!this.value){
	      this.value = this.placeholder;
	    }
	};
	emailField.onblur = function(){
	    if(this.value == this.placeholder){
	      this.placeholder = this.value;
	      this.value = null;
	      this.classList.remove("changed");
	    }
	};
}

function loadProject(value, index, array){
	index = getProjectIndex();	
	if(index===undefined){
  		//window.alert("Please select a valid project");
		return;
	}
	project = researcher.projects[index];

	if(project.description){
		descriptionField.placeholder = project.description;
		descriptionField.value = null;
	}else{
		descriptionField.placeholder = "No description Available";
		descriptionField.value = null;
	}
	descriptionField.onfocus = function(){
	    if(!this.classList.contains("changed"))
	      this.classList.add("changed"); 
	    if(!this.value){
	      this.value = this.placeholder;
	    }
	};
	descriptionField.onblur = function(){
	    if(this.value == this.placeholder){
	      this.placeholder = this.value;
	      this.value = null; 
	      this.classList.remove("changed");
	    }
	};

	document.getElementById("study_length").value = project.study_length;
	document.getElementById("study_length").onchange = function(){
		if(this.value > this.max)
			this.value = this.max;
		if(this.value < this.min)
			this.value = this.min;		
	};
	study_length = project.study_length;

	document.getElementById("tests_per_day").value = project.tests_per_day;
	document.getElementById("tests_per_day").onchange = function(){
		if(this.value > this.max)
			this.value = this.max;
		if(this.value < this.min)
			this.value = this.min;
	};
	tests_per_day = project.tests_per_day;

	document.getElementById("tests_time_interval").value = project.tests_time_interval;
	document.getElementById("tests_time_interval").onchange = function(){
		if(this.value > this.max)
			this.value = this.max;
		if(this.value < this.min)
			this.value = this.min;
	};
	tests_time_interval = project.tests_time_interval;

	document.getElementById("allow_individual_times").checked = project.allow_individual_times;
	allow_individual_times = project.allow_individual_times;
	
	document.getElementById("allow_user_termination").checked = project.allow_user_termination;
	allow_user_termination = project.allow_user_termination;

	document.getElementById("automatic_termination").checked = project.automatic_termination;
	automatic_termination = project.automatic_termination;
}

function saveProjectInfo(){
	var data = {};
	if(document.getElementById("tests_time_interval").value * (document.getElementById("tests_per_day").value - 1) > 12){
		val = parseInt(12 / (tests_per_day -1));
		tests_time_interval = val;
		document.getElementById("tests_time_interval").value = val;
	}
	
	if(descriptionField.value)
		data.description = descriptionField.value;	
	if(study_length != document.getElementById("study_length").value)
		data.study_length = document.getElementById("study_length").value;
	if(tests_per_day != document.getElementById("tests_per_day").value)
		data.tests_per_day = document.getElementById("tests_per_day").value;
	if(tests_time_interval != document.getElementById("tests_time_interval").value)
		data.tests_time_interval = document.getElementById("tests_time_interval").value;

	if(allow_individual_times != document.getElementById("allow_individual_times").checked)
		data.allow_individual_times = document.getElementById("allow_individual_times").checked;
	if(allow_user_termination != document.getElementById("allow_user_termination").checked)
		data.allow_user_termination = document.getElementById("allow_user_termination").checked;
	if(automatic_termination != document.getElementById("automatic_termination").checked)
		data.automatic_termination = document.getElementById("automatic_termination").checked;
	
	if(Object.keys(data).length === 0)
		return;
	//console.log(data);
	id = getProjectId();
	if( id===undefined ){
	  	window.alert("Please select a valid project");
		return;
	}
	$.ajax({
      url: serverURL + "/projects/" + id,
      type: 'PATCH',
      dataType: 'json',
      data: data,
      success: function(data, textStatus, xhr) {        
        if(xhr.status === 200){
			if(descriptionField.value){
				descriptionField.placeholder = data.description;
				descriptionField.value = null;
				descriptionField.classList.remove("changed");
          	}          	
          	project = researcher.projects[getProjectIndex()];
          	project.study_length = data.study_length;
          	project.tests_per_day = data.tests_per_day;
          	project.tests_time_interval = data.tests_time_interval;
          	project.allow_individual_times = data.allow_individual_times;
          	project.allow_user_termination = data.allow_user_termination;
          	project.automatic_termination = data.automatic_termination;
          	//researcher.projects[getProjectIndex()] = project;
          	localStorage.setItem("RESEARCHER", JSON.stringify(researcher)); 
        } else {
          window.alert("couldn't update project info");
        }
      }
    });
}

function saveResearcherInfo(){
	var data = {};
	if(emailField.value)
		data.email = emailField.value;
	if(passwordField.value){
	    if (confirm("Are you sure you want to change your password?\n")) {
			data.password = passwordField.value;
		} else {		
	      	passwordField.value = null;
			passwordField.classList.remove("changed");
		}
	}
	if(nameField.value)
		data.name = nameField.value;
	if(surnameField.value)
		data.surname = surnameField.value;
	if(mobileField.value)
		data.phone = mobileField.value;

	if(Object.keys(data).length === 0)
		return;
	//console.log(data);

	  $.ajax({
      url: serverURL + "/researchers/" + researcher.id,
      type: 'PATCH',
      dataType: 'json',
      data: data,
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          	if(emailField.value){
				emailField.placeholder = data.email;
				emailField.value = null;
				emailField.classList.remove("changed");
          	}
			if(passwordField.value){
		      	passwordField.value = null;
				passwordField.classList.remove("changed");
          	}
			if(nameField.value){
				nameField.placeholder = data.name;
				nameField.value = null;
				nameField.classList.remove("changed");
          	}
			if(surnameField.value){
				surnameField.placeholder = data.surname;
				surnameField.value = null;
				surnameField.classList.remove("changed");
          	}
			if(mobileField.value){
				mobileField.placeholder = data.phone;
				mobileField.value = null;
				mobileField.classList.remove("changed");
          	}
          	researcher.name = data.name;
          	researcher.surname = data.surname;
          	researcher.phone = data.phone;
          	researcher.email = data.email;
        	localStorage.setItem("RESEARCHER", JSON.stringify(researcher));      
        } else {
          window.alert("couldn't update researcher info");
        }
      }
    });
}

projectSelector.onchange = function(){
	projectId = this.value;
	//project_content.innerHTML = "";
	loadResearcherInfo();
	loadProject();	
}

$( document ).ready(function() {
	loadResearcherInfo();
	loadProject();
});

function saveInfo(){
	saveProjectInfo();
	saveResearcherInfo();
}