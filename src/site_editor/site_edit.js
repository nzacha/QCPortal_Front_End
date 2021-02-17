var modalShowButton = document.getElementById("removeItemModalToggle");

var projects_content = document.getElementById("project_container"); 

function sendDeleteLink(node, researcherId, projectId){
  $.ajax({
    url: serverURL + "/projects/link/"+projectId+"/"+researcherId,
    type: 'DELETE',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);
        node.parentNode.removeChild(node);
      } else {
        window.alert("couldn't delete link");
      }
    }
  });
}

function addManager(value, projectId, node){
  //console.log(value);
  let container = document.createElement("div");
  container.classList.add("container", "list-group-item", "p-1", "my-2");

  let title_container = document.createElement("div");
  title_container.classList.add("row", "m-1", "bg-enabled", "well-rounded");

  let researcher_container = document.createElement("div");
  researcher_container.classList.add("col-9", "p-0");
  let researcher = document.createElement("span");
  researcher.classList.add("mx-1", "p-0");
  researcher.innerHTML = value.username; 
  researcher.style = "overflow: auto;";
  researcher_container.appendChild(researcher);

  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("col-3", "p-0");
  let deleteButton = document.createElement("button");
  //deleteButton.classList.add("button");
  deleteButton.classList.add("btn", "btn-danger", "float-right");
  deleteButton.innerHTML = "x";
  deleteButton.onclick = function(){
    sendDeleteLink(container, value.id, projectId);
  }
  buttonContainer.appendChild(deleteButton);

  title_container.appendChild(researcher_container);
  title_container.appendChild(buttonContainer);
  container.appendChild(title_container);

  node.insertBefore(container, node.firstChild);
}

function sendLinkResearcher(node){
  $.ajax({
    url: serverURL + "/projects/",
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        data.forEach(loadProject);
        //console.log(data);
      } else {
        window.alert("couldn't update question");
      }
    }
  });
}

function sendDeleteProject(id, node){
  $.ajax({
    url: serverURL + "/projects/"+id,
    type: 'DELETE',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);
        node.parentNode.removeChild(node);
      } else {
        window.alert("couldn't delete project");
      }
    }
  });
}

function loadProject(value, index, array){
  value.deleteButtonFunc = sendDeleteProject;
  value.headerTitle = "Project: ";
  value.headerTitleEditable = value.name;

  value.content = value.administrators;
  value.hasContentAddButton = true;
  value.addContentCallback = populateManagerModal;
  value.addContentFunc = addManager; 

  let newListing = new ItemListing(value, index, projects_content);
}

function optionFunction(value, node, projectId){
  $.ajax({
  url: serverURL + "/projects/link/"+projectId+"/"+value.id,
  type: 'POST',
  dataType: 'json',
  success: function(data, textStatus, xhr) {
    if(xhr.status === 200){
      //console.log(data);
      addManager(value, projectId, node)
      modalShowButton.click();       
    } else {
      window.alert("couldn't link project");
    }
  },
  error: function(error){
    modalShowButton.click();  
  }
  });   
}

function addModalOption(modalBody, value, projectContainer, projectId){
  let button = document.createElement("div");
  button.classList.add("m-1", "btn", "btn-info", "option");
  button.innerHTML = value.username;
  button.onclick = function() {
    optionFunction(value, projectContainer, projectId);
  }
  modalBody.appendChild(button);
}

function populateManagerModal(node, projectId){
  $.ajax({
  url: serverURL + "/administrators",
  type: 'GET',
  dataType: 'json',
  success: function(data, textStatus, xhr) {
    if(xhr.status === 200){
      modalBody = document.getElementById("removeItemModalBody");
      modalBody.innerHTML = "";
      //console.log(data);
      for(var i=0; i<data.length; i++){
        addModalOption(modalBody, data[i], node, projectId);
      }
      modalShowButton.click();        
    } else {
      window.alert("couldn't find researchers");
    }
  }
  });    
}

function addProject(){
  info = {"name": "new project"};
  $.ajax({
    url: serverURL + "/projects/",
    type: 'POST',
    dataType: 'json',
    data: info,
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        loadProject(data);
        //console.log(data);
      } else {
        window.alert("couldn't add project");
      }
    }
  });
}

function loadProjects(){
  $.ajax({
    url: serverURL + "/projects/",
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        data.forEach(loadProject);
        //console.log(data);
      } else {
        window.alert("couldn't load projects");
      }
    }
  });
}
loadProjects();