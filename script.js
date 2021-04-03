var usernameField = document.getElementById("username_field");
var passwordField = document.getElementById("password_field");

const serverURL = "http://127.0.0.1:5050";

function authenticateUser(){
	username = usernameField.value;
	if(username === ""){
		window.alert("Please provide a username");
		return
	}
	password = passwordField.value;
	if(password === ""){
		window.alert("Please provide a password");
		return
	}
  console.log(serverURL)
    $.ajax({
      url: serverURL+"/authenticate",
      type: 'POST',
      dataType: 'json',
      data: {"username": username, "password": password},
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          let pageURL;
  	      pageURL = "./src/navigation/index";
		      document.getElementById("html_content").innerHTML='<object style="height:100%; width:100%; padding:0px;" class="container-fluid" type="text/html" data="'+pageURL+'.html" ></object>'
		      localStorage.setItem("Account", JSON.stringify(data));   
		} else {
  	       window.alert(data);
        }
      },
      error: function (error) {
        window.alert("Wrong Username and/or Password");
      }
    });
}