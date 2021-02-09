var researcher_content = document.getElementById("researcher_container");

function addResearcher(){
  email = window.prompt("Please provide an email");
  if(!email)
    return;
  name = window.prompt("Please provide a name");
  if(!name)
    return;
  surname = window.prompt("Please provide a surname");
  if(!surname)
    return;
  isSuper = window.prompt("is the user a super user?", "NO");
  password = "password";
  if(isSuper!="yes" || isSuper!="y" || isSuper!="Yes"){
    isSuper = false;
  }else{
    isSuper = true;
  }

  info = {"email": email, "password": password, "name": name, "surname": surname, "isSuper": isSuper};
  $.ajax({
    url: serverURL + "/researchers/",
    type: 'POST',
    dataType: 'json',
    data: info,
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        loadResearcher(info);
        //console.log(info);
      } else {
        window.alert("couldn't add researcher");
      }
    }
  });
}

function sendDeleteResearcher(id, node){
  $.ajax({
    url: serverURL + "/researchers/"+id,
    type: 'DELETE',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        node.parentNode.removeChild(node);
      } else {
        window.alert("couldn't delete researcher");
      }
    }
  });
}

function loadResearcher(value, index, array){
  let container = document.createElement("div");
  container.classList.add("card");
  container.classList.add("mt-2");
  container.classList.add("p-2");

  let container_header = document.createElement("div");
  container_header.classList.add("card-header");

  let button = document.createElement("button");
  button.classList.add("ml-2");
  button.classList.add("btn");
  button.classList.add("btn-danger");
  button.classList.add("float-right");
  button.innerHTML = "x";
  button.onclick = function(){
    if (confirm("Are you sure you want to delete this researcher?\n"+value.email)) {
      sendDeleteResearcher(value.id, container);
    }   
  }

  container_header.appendChild(button);
  container.appendChild(container_header);

  let researcherName = document.createElement("span");
  researcherName.innerHTML = "Researcher";  
  researcherName.style = "overflow: auto;"
  researcherName.classList.add("mr-2");
  researcherName.classList.add("changed");
  container_header.appendChild(researcherName);
  
  let container_body = document.createElement("div");
  container_body.classList.add("card-body");
  container.appendChild(container_body);

  let researcherNameInput = document.createElement("span");
  researcherNameInput.classList.add("mt-2");
  researcherNameInput.innerHTML = value.email;
  researcherNameInput.contentEditable = true;
  researcherNameInput.onblur = function(){ 
    $.ajax({
    url: serverURL + "/researchers/"+value.id,
    type: 'PATCH',
    dataType: 'json',
    data: {"email": researcherNameInput.value},
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);        
      } else {
        window.alert("couldn't update researcher");
      }
    }
  });
  }
  container_body.appendChild(researcherNameInput);

  researcher_content.appendChild(container);
}

function loadResearchers(){ 
  $.ajax({
    url: serverURL + "/researchers/",
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        data.forEach(loadResearcher);
        //console.log(data);
      } else {
        window.alert("couldn't load researchers");
      }
    }
  });
}
loadResearchers();