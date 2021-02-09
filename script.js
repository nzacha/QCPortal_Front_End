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

var usernameField = document.getElementById("username_field");
var passwordField = document.getElementById("password_field");

const serverURL = "http://localhost:5050";
//const serverURL = "localhost:5050"
var account;
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

    $.ajax({
      url: serverURL+"/authentication",
      type: 'POST',
      dataType: 'json',
      data: {"username": username, "password": password},
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          let pageURL;
  	      pageURL = "./Portal/src/navigation/index";
		      document.getElementById("html_content").innerHTML='<object style="height:100%; width:100%; padding:0px;" class="container-fluid" type="text/html" data="'+pageURL+'.html" ></object>'
		      localStorage.setItem("RESEARCHER", JSON.stringify(data));                               
        } else {
  	       window.alert(data);
        }
      },
      error: function (error) {
        window.alert("Wrong Username and/or Password");
      }
    });
}