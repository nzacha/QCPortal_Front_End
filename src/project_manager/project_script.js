var modalShowButton = document.getElementById("removeItemModalToggle");

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

function addResearcher(value, projectId, node){
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("list-group-item");
  container.classList.add("p-1");
  container.classList.add("my-2");


  let title_container = document.createElement("div");
  title_container.classList.add("row");
  title_container.classList.add("m-1");
  title_container.classList.add("bg-enabled");
  title_container.classList.add("well-rounded");

  let researcher_container = document.createElement("div");
  researcher_container.classList.add("col-9");
  researcher_container.classList.add("p-0");
  let researcher = document.createElement("span");
  researcher.classList.add("mx-1");
  researcher.classList.add("p-0");
  researcher.innerHTML = value.email; 
  researcher.style = "overflow: auto;";
  researcher_container.appendChild(researcher);

  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("col-3");
  buttonContainer.classList.add("p-0");
  let deleteButton = document.createElement("button");
  //deleteButton.classList.add("button");
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-danger");
  deleteButton.classList.add("float-right");
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
  let container = document.createElement("div");
  container.classList.add("card");
  container.classList.add("mb-2");
  container.classList.add("p-2");

  let container_header = document.createElement("div");
  container_header.classList.add("card-header");

  let button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add("btn-danger");
  button.classList.add("float-right");
  button.innerHTML = "x";
  button.onclick = function(){
    if (confirm("Are you sure you want to delete this project?\n"+value.name)) {
      sendDeleteProject(value.id, container);
    }   
  }
  container_header.appendChild(button);
  container.appendChild(container_header);

  let projectName = document.createElement("span");
  projectName.innerHTML = "Project name: ";  
  projectName.classList.add("mr-2");
  projectName.classList.add("changed");
  let projectNameInput = document.createElement("span");
  projectNameInput.innerHTML = value.name;
  projectNameInput.contentEditable = true;
  projectNameInput.onblur = function(){
    $.ajax({
    url: serverURL + "/projects/"+value.id,
    type: 'PATCH',
    dataType: 'json',
    data: { "name": projectNameInput.innerHTML},
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);        
      } else {
        window.alert("couldn't update project");
      }
    }
  });
  }
  projectName.appendChild(projectNameInput);
  container_header.appendChild(projectName);

  let projectResearchers = document.createElement("div");
  projectResearchers.classList.add("card-body");
  container.appendChild(projectResearchers);

  array = value.researchers;
  if(array){
    for(var i=0; i< array.length; i++)
      addResearcher(array[i], value.id, projectResearchers);
  }
  addResearcherButton(projectResearchers, value.id);
  node = document.getElementById("project_container");
  node.insertBefore(container, node.firstChild);
}

function optionFunction(value, node, projectId){
  $.ajax({
  url: serverURL + "/projects/link/"+projectId+"/"+value.id,
  type: 'POST',
  dataType: 'json',
  success: function(data, textStatus, xhr) {
    if(xhr.status === 200){
      //console.log(data);
      addResearcher(value, projectId, node)
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

function addModalButton(modalBody, value, projectContainer, projectId){
  let button = document.createElement("div");
  button.classList.add("m-1");
  button.classList.add("btn");
  button.classList.add("btn-info");
  button.classList.add("option");
  button.innerHTML = value.email;
  button.onclick = function() {
    optionFunction(value, projectContainer, projectId);
  }
  modalBody.appendChild(button);
}

function addResearcherButton(node, projectId){
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("p-1");
  container.classList.add("my-1");
  let button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add("btn-info");
  button.innerHTML = "+";
  button.onclick = function(){    
    $.ajax({
    url: serverURL + "/researchers",
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        modalBody = document.getElementById("removeItemModalBody");
        modalBody.innerHTML = "";
        //console.log(data);
        for(var i=0; i<data.length; i++)
          addModalButton(modalBody, data[i], node, projectId);
        modalShowButton.click();        
      } else {
        window.alert("couldn't find researchers");
      }
    }
    });    
  }
  container.appendChild(button);

  node.appendChild(container);
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