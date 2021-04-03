const DISPLAY_SIZES = {
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
}
var display_size = DISPLAY_SIZES.SMALL; 

var inputs = [];

function createLabels(container, dataImport){
	let sub_header = document.createElement("div");
	sub_header.classList.add("card-header", "py-1");
	
	let sub_container = document.createElement("div");
	//sub_container.classList.add("container-fluid", "row");
	sub_container.classList.add("container-fluid", "row", "p-0");
	sub_header.appendChild(sub_container);

  if(!dataImport){
    var weekLabel = document.createElement("div");
  	weekLabel.classList.add("col-4")
  	weekLabel.innerHTML = "week";
    sub_container.appendChild(weekLabel);
  }

	let singleLabel = document.createElement("div");
  if(!dataImport){
    singleLabel.classList.add("col-4");
	}else{
    singleLabel.classList.add("col-6");
  }
  singleLabel.innerHTML = "single";
  sub_container.appendChild(singleLabel);

	let accumulatedLabel = document.createElement("div");
	if(!dataImport){
    accumulatedLabel.classList.add("col-4");
  }else{
    accumulatedLabel.classList.add("col-6");
  }
	accumulatedLabel.innerHTML = "accumulated";		
  sub_container.appendChild(accumulatedLabel);
  
  container.appendChild(sub_header);
}

function createInputs(parentNode, categoryId, disciplineId){
  let container = document.createElement("div");
  container.classList.add("container-fluid", "row");

  let label_single_container = document.createElement("div");
  label_single_container.classList.add("col-6", "px-2");
  container.appendChild(label_single_container);

  let label_single = document.createElement("input");
  label_single.valueType = "single"; 
  label_single.disciplineId = disciplineId; 
  label_single.categoryId = categoryId; 
  label_single.classList.add("w-100");
  label_single.onblur = function(){
    if(this.value !== "") this.style.border="1px solid black";
  };
  inputs.push(label_single);
  label_single_container.appendChild(label_single);

  let label_accumulated_container = document.createElement("div");
  label_accumulated_container.classList.add("col-6", "px-2");
  container.appendChild(label_accumulated_container);

  let label_accumulated = document.createElement("input");
  label_accumulated.valueType = "accumulated"; 
  label_accumulated.disciplineId = disciplineId; 
  label_accumulated.categoryId = categoryId; 
  label_accumulated.classList.add("w-100");
  label_accumulated.onblur = function(){
    if(this.value !== "") this.style.border="1px solid black";
  };
  inputs.push(label_accumulated);
  label_accumulated_container.appendChild(label_accumulated);

  parentNode.appendChild(container);
}

function isFormComplete(){
  var retVal = true;
  for(var i=0; i<inputs.length; i++){
    if(inputs[i].value === ""){
      inputs[i].placeholder = "Please provide a value"
      inputs[i].style.border="2px solid red";
      retVal = false;
      //console.log(i + " " + inputs[i].value);
    }else{
      inputs[i].style.border="1px solid black";
    }
  }
  return retVal;
}

async function retrieveData(obj, dataImport){
  try{
    obj.data = await $.ajax({
      url: (dataImport) ? serverURL + "/categories" : serverURL + "/data/project/"+getProjectId(),
      type: 'GET',
      dataType: 'json',
      success: function(data, textStatus, xhr) {     
        if(xhr.status === 200){
          obj.populate(data);
          obj.draw(obj.parentNode);
        } else {
          window.alert("an error occured");
        }
      },
      error: function(xhr, status, error) {  
        console.log(error);
      }   
    });
  }catch (rejectedValue){}
}

function sendData(obj){
  if(!obj) return;
  $.ajax({
    url: serverURL + "/data/" + getProjectId(),
    type: 'POST',
    dataType: 'json',
    data: {categories: obj},
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);
        document.getElementById("removeItemModalToggle").click();
        project.week++;
        document.getElementById("week-label").innerHTML = "Week: "+project.week;
      } else {
        window.alert("couldn't add information");
      }
    },
    error: function(xhr, status, error) {  
      window.alert("can't import any new information, current week data has already been imported");
    }  
  });
}

function sendFormData(dTable){  
  var payload = [];
  for(var input=0; input<inputs.length; input++){
    if(inputs[input].value === "") continue;

    let valueType = inputs[input].valueType;
    let disciplineId = inputs[input].disciplineId;
    let categoryId = inputs[input].categoryId;

    let found = false;
    let index=0;
    for(var i=0; i<payload.length; i++)
      if(payload[i].id === categoryId)
        found = true;
    if(!found) {
      payload.push({id: categoryId, disciplines: []});
      payload[payload.length-1].disciplines.push({id: disciplineId});
    }

    found = false;
    for(var i=0; i<payload.length; i++){
      for(var j=0; j<payload[i].disciplines.length; j++){
        if(payload[i].disciplines[j].id === disciplineId)
          found = true;
      }
    }
    if(!found) {
      for(var i=0; i<payload.length; i++){
        if(payload[i].id === categoryId)
          payload[i].disciplines.push({id: disciplineId});
      }
    }

    for(var i=0; i<payload.length; i++){
      for(var j=0; j<payload[i].disciplines.length; j++){
        if(payload[i].id === categoryId && payload[i].disciplines[j].id === disciplineId)
          if(valueType === "single"){
            payload[i].disciplines[j].single = inputs[i].value; 
          }else{
            payload[i].disciplines[j].accumulated = inputs[i].value; 
          }
      }
    }
  }

  //console.log(payload); 
  sendData(payload);
}

class DataTable {
  constructor(title, parentNode, dataImport){
    this.title = title;
    this.parentNode = parentNode;
    this.dataImport = dataImport;
    inputs = [];
    retrieveData(this, dataImport);
  }


  populate(data){  
    this.categories = [];
    for(var i=0; i<data.length; i++){
      this.categories.push(new DataCategory(data[i].id, data[i].title, data[i].disciplines, this.dataImport));
    }
  }

  draw(node){
    for(var i=0; i<this.categories.length; i++){
      this.categories[i].draw(node);
    }
  }
}

class DataCategory {
  constructor(id, category, disciplines, dataImport){
    this.id = id;
    this.category = category;
    this.data = disciplines;
    this.dataImport = dataImport;
    this.disciplines = [];
    //console.log(disciplines);

    for(var i=0; i<disciplines.length; i++){
      this.addDiscipline(disciplines[i]);
    }
  }

  addDiscipline(discipline){
    //console.log(discipline);
    this.disciplines.push(new DataDiscipline(discipline.id, this.id, discipline.name, discipline.data, this.dataImport)); 
  }

  draw(parentNode){
    this.container = document.createElement("div");
    this.container.classList.add("container-fluid", "p-0");

    this.card = document.createElement("div");
  	this.card.classList.add("card", "mb-2");
  	this.container.appendChild(this.card);
      
    parentNode.appendChild(this.container);

  	this.card_header = document.createElement("div");
  	this.card_header.classList.add("card-header", "changed");
  	this.card_header.innerHTML = this.category;
  	this.card.appendChild(this.card_header);
  	    
    //add children and labels
    if(display_size === DISPLAY_SIZES.LARGE){
    	createLabels(this.card, this.dataImport);
    }
    let disciplines = this.disciplines;
    for(var i=0; i<this.disciplines.length; i++){
      disciplines[i].draw(this.card);
    }
  }
}

class DataDiscipline{
  constructor(id, categoryId, discipline, entries, dataImport){
    this.id = id;
    this.categoryId = categoryId;
    this.accumulated = 0;
    this.entries = [];
    this.discipline = discipline;
    this.dataImport = dataImport;
    if(!dataImport){
      for(var i=0; i<entries.length; i++){
        this.addEntry(entries[i]);
      }
    }
  }

  addEntry(entry){
    this.accumulated += entry.accumulated;
    this.entries.push(new DataItem(entry.id, entry.week, entry.single, entry.accumulated, this.dataImport));
  }

  draw(parentNode){
    this.card_header = document.createElement("div");
    this.card_header.classList.add("card-header", "changed", "py-2");
    this.card_header.innerHTML = this.discipline;
    parentNode.appendChild(this.card_header);

  	this.container_body = document.createElement("div");
  	if(display_size === DISPLAY_SIZES.SMALL){
  	    this.container_body.classList.add("card-body", "p-2", "my-2");
  	    createLabels(parentNode, this.dataImport);
  	}else if(display_size === DISPLAY_SIZES.LARGE){
  	    this.container_body.classList.add("card-body", "p-0");
  	}
    parentNode.appendChild(this.container_body);
	
    if(this.dataImport){
      createInputs(this.container_body, this.categoryId, this.id);
    }else{
      for(var i=0; i<this.entries.length; i++){
        this.entries[i].draw(this.container_body);
      }
    }
  }
}

class DataItem {
  constructor(id, week, single, accumulated, dataImport){
    this.id = id;
    this.week = week;
    this.single = single;
    this.accumulated = accumulated;
    this.dataImport = dataImport;
  }

  draw(parentNode){
    this.container = document.createElement("div");
    this.container.classList.add("container-fluid", "row");

    //this.row = document.createElement("div");
    //this.row.classList.add("row");
    //this.container.appendChild(this.row);

    this.label = document.createElement("div");
    this.label.classList.add("col-4");
    this.label.innerHTML = this.week;
    this.container.appendChild(this.label);

    this.label_single = document.createElement("div");
    this.label_single.classList.add("col-4");
    this.label_single.innerHTML = this.single;
    this.container.appendChild(this.label_single);

    this.label_accumulated = document.createElement("div");
    this.label_accumulated.classList.add("col-4");
    this.label_accumulated.innerHTML = this.accumulated;
    this.container.appendChild(this.label_accumulated);

    parentNode.appendChild(this.container);
    //console.log(this.id +" "+this.week +" "+ this.single+" "+this.accumulated);
  }
}