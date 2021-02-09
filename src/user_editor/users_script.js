var users;

var userList = document.getElementById("user-list");
var modalShowButton = document.getElementById("removeItemModalToggle");

var userCount=0;
function loadUser(value, index, array){
  index = ++userCount;
  let user = document.createElement("div");
  user.classList.add("bg-enabled");
  user.classList.add("well-rounded");
  //user.classList.add("rounded-pill");
  user.classList.add("list-group-item");
  user.classList.add("mb-2");
  user.classList.add("w-100");

  let user_info = document.createElement("div");
  user_info.classList.add("row");

  let user_id = document.createElement("div");
  user_id.style = "display:none;";
  //user_id.innerHTML = "ID) ";
  let user_id_value = document.createElement("label");
  user_id_value.innerHTML = value.id;
  user_id_value.id = "user_id_value_"+index;
  user_id.appendChild(user_id_value);
  user_info.appendChild(user_id);

  let user_code = document.createElement("div");
  user_code.classList.add("col-sm-12");
  user_code.classList.add("col-md-6");
  user_code.classList.add("col-lg-3");
  user_code.classList.add("changed");
  user_code.style = "text-align:center;"
  //user_id.innerHTML = "ID) ";
  let user_code_value = document.createElement("label");
  user_code_value.innerHTML = value.code;
  user_code_value.classList.add("changed");
  user_code.appendChild(user_code_value);
  user_info.appendChild(user_code);

  let user_name = document.createElement("div");
  user_name.classList.add("col-sm-12");
  user_name.classList.add("col-md-6");
  user_name.classList.add("col-lg-3");
  user_name.style = "text-align:center;"
  //user_name.innerHTML = "Name: ";
  let user_name_value = document.createElement("span");
  if(value.name === "")
    user_name_value.innerHTML = "--";
  else
    user_name_value.innerHTML = value.name;
  user_name_value.id = "user_name_value_"+index;
  user_name_value.classList.add("p-2");    
  user_name_value.contentEditable = true;  
  user_name_value.onfocus = function(){
    if(!this.classList.contains("changed"))
      this.classList.add("changed"); 
  };
  user_name.appendChild(user_name_value);
  user_info.appendChild(user_name);

  let user_surname = document.createElement("div");
  user_surname.classList.add("col-sm-12");
  user_surname.classList.add("col-md-6");
  user_surname.classList.add("col-lg-3");
  user_surname.style = "text-align:center;"
  //user_surname.innerHTML = "Surname: ";
  let user_surname_value = document.createElement("span");
  if(value.name === "")
    user_surname_value.innerHTML = "--";
  else
    user_surname_value.innerHTML = value.surname;
  user_surname_value.classList.add("p-2"); 
  user_surname_value.contentEditable = true;
  user_surname_value.id = "user_surname_value_"+index;
  user_surname_value.onfocus = function(){
    if(!this.classList.contains("changed"))
      this.classList.add("changed"); 
  };
  user_surname.appendChild(user_surname_value);
  user_info.appendChild(user_surname);

  let delete_user = document.createElement("div");
  delete_user.classList.add("col-sm-12");
  delete_user.classList.add("col-md-6");
  delete_user.classList.add("col-lg-3");
  delete_user.classList.add("d-flex");
  delete_user.classList.add("justify-content-center");
  if(value.isActive){ 
    enable(user, value, delete_user, user_name_value, user_surname_value, value.reason_for_exit);
  }else{
    disable(user, value, delete_user, user_name_value, user_surname_value, value.reason_for_exit);
  }
  user_info.appendChild(delete_user);

  user.appendChild(user_info);
  
  //userList.appendChild(user);
  userList.insertBefore(user, userList.firstChild);
}

function compareFunction(obj1, obj2){
  return obj1.id-obj2.id;
}

function loadUsers(){
  id = getProjectId();
  if(id === undefined){
    //window.alert("Please select a valid project");
    return;
  }
  $.ajax({
      url: serverURL + "/users/MyUsers/" + id,
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          users = res;
          users.sort(compareFunction);
          users.forEach(loadUser);  
      }
  });
}

researcher = JSON.parse(localStorage.getItem("RESEARCHER"));

dummyUser = {  
  "name":"",
  "surname":"",
  "isActive": true,  
  "study_length": researcher.study_length,
  "tests_per_day": researcher.tests_per_day,
  "tests_time_interval": researcher.tests_time_interval,
  "allow_individual_times": researcher.allow_individual_times,
  "allow_user_termination": researcher.allow_user_termination,
  "automatic_termination": researcher.automatic_termination,
}
function addUser(){
  dummyUser.projectId = getProjectId();
  if( dummyUser.projectId===undefined ){
    window.alert("Please select a valid project");
    return;
  }
  //console.log(dummyUser);
  $.ajax({
    url: serverURL + "/users",
    type: 'POST',
    dataType: 'json',
    data: dummyUser,
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        dummyUser.id = data.id;
        dummyUser.code = data.code;
        loadUser(dummyUser, userList.childElementCount);
      } else {
        window.alert("couldn't add user");
      }
    }
  });
}

function enable(node, value, deleteCol, nameInput, surnameInput, reason_for_exit){    
    node.classList.remove("bg-disabled");
    node.classList.add("bg-enabled");  

    nameInput.contentEditable = true;
    surnameInput.contentEditable = true;

    deleteCol.innerHTML="";

    let delete_user_button = document.createElement("button");
    delete_user_button .innerHTML = "X";
    delete_user_button.setAttribute("type", "button");
    delete_user_button.classList.add("btn");
    delete_user_button.classList.add("btn-danger");
    //delete_user_button.classList.add("float-right");
    delete_user_button.setAttribute("data-toggle", "modal");
    delete_user_button.setAttribute("data-target", "#removeItemModal");
    delete_user_button.onclick = function(event){
      event.stopPropagation();
      modalShowButton.click();
      deleteUser(node, value, delete_user_button, nameInput, surnameInput, reason_for_exit);
      //modalShowButton.click();
    }
    deleteCol.appendChild(delete_user_button);
}

function activateUser(userObj, user, activationButton, nameInput, surnameInput){
  let reason = "";
  $.ajax({
      url: serverURL + "/users/activate/" + user.id,
      type: 'GET',
      dataType: 'json',
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          //console.log(data);
          enable(userObj, user, activationButton, nameInput, surnameInput)
        } else {
          window.alert("couldn't activate user");
        }
      }
  });
}

function disable(node, value, deleteCol, nameInput, surnameInput, reason_for_exit){
  node.classList.remove("bg-enabled");
  node.classList.add("bg-disabled");    

  nameInput.contentEditable = false;
  surnameInput.contentEditable = false;

  let reason_label = document.createElement("label");
  reason_label.innerHTML = reason_for_exit;
  reason_label.setAttribute("type", "button");
  reason_label.classList.add("changed");
  //reason_label.classList.add("btn");
  //reason_label.classList.add("btn-warning");
  reason_label.setAttribute("data-toggle", "modal");
  reason_label.setAttribute("data-target", "#removeItemModal");
  reason_label.onclick = function(event){
    event.stopPropagation();
    //modalShowButton.click();
    activateUser(node, value, deleteCol, nameInput, surnameInput, reason_for_exit);
    //modalShowButton.click();
  }

  deleteCol.appendChild(reason_label);
  deleteCol.classList.add("text-right");
}

function sendDeleteUser(id, node, value, deleteButton, nameInput, surnameInput, reason_for_exit){
  let reason = "Deleted by Me";
  $.ajax({
      url: serverURL + "/users/" + id,
      type: 'DELETE',
      dataType: 'json',
      data: {"reason": reason},
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          //node.parentNode.removeChild(node);
          disable(node, value, deleteButton.parentNode, nameInput, surnameInput, reason);
          deleteButton.parentNode.removeChild(deleteButton);
        } else {
          window.alert("couldn't disable user");
        }
      }
  });
}

function deleteUser(node, value, deleteButton, nameInput, surnameInput, reason_for_exit){
  let modal = document.getElementById("removeItemModal");
  let modalTItle = document.getElementById("removeItemModalTitle");
  modalTItle.innerHTML = "Do you want to delete user " + value.id +"?";
  let modalBody = document.getElementById("removeItemModalBody");
  modalBody.innerHTML = "ID: "+value.code+"</br>Name: "+value.name+"</br>Surname: "+value.surname;
  let modalAccept = document.getElementById("removeItemModalAccept");
  modalAccept.onclick = function(){
    sendDeleteUser(value.id, node, value, deleteButton, nameInput, surnameInput);
    modalShowButton.click();
  };  
}

function saveUser(index){
  let id_input = document.getElementById("user_id_value_"+index);
  let name_input = document.getElementById("user_name_value_"+index);
  let surname_input = document.getElementById("user_surname_value_"+index);


  let changes = {};
  if (name_input.classList.contains("changed")){
    changes.name = name_input.innerHTML; 
  }  
  if (surname_input.classList.contains("changed")){
    changes.surname = surname_input.innerHTML; 
  }  
  //console.log(changes);
  if(Object.keys(changes).length === 0)
    return;

  $.ajax({
      url: serverURL + "/users/" + parseInt(id_input.innerHTML),
      type: 'PATCH',
      dataType: 'json',
      data: {"name": changes.name, "surname": changes.surname},
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          if(changes.name)
            name_input.classList.remove("changed");
          if(changes.surname)
            surname_input.classList.remove("changed");
        } else {
          window.alert("couldn't update user");
        }
      }
    });
}

function saveUsers(){ 
  for(var i=1; i<=userCount; i++){
    let id_input = document.getElementById("user_id_value_" +i);
    if(id_input)
      saveUser(i);
  }
}

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.height = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.height = "0";
}

projectSelector.onchange = function(){
  projectId = this.value;
  userList.innerHTML = "";
  loadUsers();
}

$( document ).ready(function() {
    loadUsers();
});