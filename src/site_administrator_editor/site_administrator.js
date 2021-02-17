var administrators_content = document.getElementById("researcher_container");

endpoint = serverURL + "/administrators/";

function addAdministrator(){
  username = window.prompt("Please provide a username");
  if(!username)
    return;
  password = "password";
  name = window.prompt("Please provide a name");
  surname = window.prompt("Please provide a surname");

  info = {"username": username, "password": password, "name": name, "surname": surname};
  $.ajax({
    url: endpoint,
    type: 'POST',
    dataType: 'json',
    data: info,
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        loadAdministrator(data);
        //console.log(info);
      } else {
        window.alert("couldn't add administrator");
      }
    }
  });
}

function sendDeleteAdministrator(id, node){
  $.ajax({
    url: endpoint + id,
    type: 'DELETE',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        node.parentNode.removeChild(node);
      } else {
        window.alert("couldn't delete administrator");
      }
    }
  });
}

function sendUpdateAdministrator(id, value){
  $.ajax({
      url: endpoint,
      type: 'PATCH',
      dataType: 'json',
      data: {"username": value},
      success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);        
      } else {
        window.alert("couldn't update administrator");
      }
      }
    })
}

function loadAdministrator(value, index, array){
  value.deleteButtonFunc = sendDeleteAdministrator;
  value.headerTitle = "Administrator";
  value.bodyContent = value.username;
  value.bodyContentOnBlurFunc = sendUpdateAdministrator;
  
  let newListing = new ItemListing(value, index, administrators_content);
  return;
}

function loadAdministrators(){ 
  $.ajax({
    url: endpoint,
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);
        data.forEach(loadAdministrator);
      } else {
        window.alert("couldn't load administrators");
      }
    }
  });
}
loadAdministrators();