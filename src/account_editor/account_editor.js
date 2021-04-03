var nameField = document.getElementById("name_input");
var surnameField = document.getElementById("surname_input");
var usernameField = document.getElementById("username_input");
var passwordField = document.getElementById("password_input");

var account;

var project_content = document.getElementById("project_content");

function loadAccountInfo(){
	account = JSON.parse(localStorage.getItem("Account"));
	//console.log(account);
	nameField.placeholder = account.name;
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

	surnameField.placeholder = account.surname;
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

	usernameField.placeholder = account.username;	
	usernameField.onfocus = function(){
	    if(!this.classList.contains("changed"))
	      this.classList.add("changed"); 
	    if(!this.value){
	      this.value = this.placeholder;
	    }
	};
	usernameField.onblur = function(){
	    if(this.value == this.placeholder){
	      this.placeholder = this.value;
	      this.value = null;
	      this.classList.remove("changed");
	    }
	};
}

function saveAccountInfo(){
	var data = {};
	if(usernameField.value)
		data.username = usernameField.value;
	if(passwordField.value){
	    confirmPassword = prompt("Please confirm new password");
	    if(passwordField.value === confirmPassword){
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

	if(Object.keys(data).length === 0)
		return;
		//console.log(data);
		
		$.ajax({
			url: serverURL + "/" + account.accountType + "s/"  + account.id,
			type: 'PATCH',
			dataType: 'json',
			data: data,
			success: function(data, textStatus, xhr) {
			if(xhr.status === 200){
			  	if(usernameField.value){
					usernameField.placeholder = data.username;
					usernameField.value = null;
					usernameField.classList.remove("changed");
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
			  	account.name = data.name;
			  	account.surname = data.surname;
			  	account.username = data.username;
				localStorage.setItem("Account", JSON.stringify(account)); 
			} else {
			  window.alert("couldn't update account info");
			}
		}
    });
}

projectSelector.onchange = function(){
	projectId = this.value;
}

$( document ).ready(function() {
	loadAccountInfo();
});

function saveInfo(){
	saveAccountInfo();
}