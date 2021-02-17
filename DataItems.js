const DISPLAY_SIZES = {
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
}
var display_size = DISPLAY_SIZES.LARGE; 

function createLabels(container){
	let sub_header = document.createElement("div");
	sub_header.classList.add("card-header");
	
	let sub_container = document.createElement("div");
	//sub_container.classList.add("container-fluid", "row");
	sub_container.classList.add("container-fluid", "row", "p-0");
	sub_header.appendChild(sub_container);

	let weekLabel = document.createElement("div");
	weekLabel.classList.add("col-4")
	weekLabel.innerHTML = "week";

	let singleLabel = document.createElement("div");
	singleLabel.classList.add("col-4");
	singleLabel.innerHTML = "single";

	let accumulatedLabel = document.createElement("div");
	accumulatedLabel.classList.add("col-4");
	accumulatedLabel.innerHTML = "accumulated";		

    sub_container.appendChild(weekLabel);
	sub_container.appendChild(singleLabel);
    sub_container.appendChild(accumulatedLabel);
    container.appendChild(sub_header);
}

class DataTable {
  constructor(title){
    this.title = title;
    this.retrieveData();
  }

  async retrieveData(){
    try{
      this.data = await $.ajax({
        url: "http://127.0.0.1:5050/" + "data/project/" +1,
        type: 'GET',
        dataType: 'json',
        success: function(data, textStatus, xhr) {     
          if(xhr.status === 200){
            return data;
          } else {
            window.alert("an error occured");
          }
        },
        error: function(xhr, status, error) {  
          console.log(error);
        }   
      });
    }catch (rejectedValue){}

    this.populate(this.data);
    this.draw(document.getElementById("html_content"));
  }

  populate(data){  
    this.categories = [];
    for(var i=0; i<data.length; i++){
      this.categories.push(new DataCategory(data[i].id, data[i].title, data[i].disciplines));
    }
  }

  draw(parentNode){

    for(var i=0; i<this.categories.length; i++){
      this.categories[i].draw(parentNode);
    }
  }
}

class DataCategory {
  constructor(id, category, disciplines){
    this.id = id;
    this.category = category;
    this.data = disciplines;
    this.disciplines = [];
    //console.log(disciplines);

    for(var i=0; i<disciplines.length; i++){
      this.addDiscipline(disciplines[i]);
    }
  }

  addDiscipline(discipline){
    //console.log(discipline);
    this.disciplines.push(new DataDiscipline(discipline.id, discipline.name, discipline.data)); 
  }

  draw(parentNode){
    this.container = document.createElement("div");
    this.container.classList.add("container-fluid", "mt-2", "p-2");

    this.card = document.createElement("div");
	this.card.classList.add("card", "mt-2", "p-2");
	this.container.appendChild(this.card);
    
    parentNode.appendChild(this.container);

	this.card_header = document.createElement("div");
	this.card_header.classList.add("card-header", "col-sm-12", "col-md-3");
	this.card_header.innerHTML = this.category;
	this.card.appendChild(this.card_header);
	    
    //add children and labels
    if(display_size === DISPLAY_SIZES.LARGE){
    	createLabels(this.card);
    }
    let disciplines = this.disciplines;
    for(var i=0; i<this.disciplines.length; i++){
      disciplines[i].draw(this, this.card);
    }
  }
}

class DataDiscipline{
  constructor(id, discipline, entries){
    this.id = id;
    this.accumulated = 0;
    this.entries = [];
    this.discipline = discipline;
    for(var i=0; i<entries.length; i++){
      this.addEntry(entries[i]);
    }
  }

  addEntry(entry){
    this.accumulated += entry.accumulated;
    this.entries.push(new DataItem(entry.id, entry.week, entry.single, entry.accumulated));
  }

  draw(dCategory, parentNode){
	this.container_body = document.createElement("div");
	if(display_size === DISPLAY_SIZES.SMALL){
	    this.container_body.classList.add("card-body", "p-2");
	    createLabels(parentNode);
	}else if(display_size === DISPLAY_SIZES.LARGE){
	    this.container_body.classList.add("card-body", "p-0");
	}
    parentNode.appendChild(this.container_body);
	
    for(var i=0; i<this.entries.length; i++){
      this.entries[i].draw(this.container_body);
    }
  }
}

class DataItem {
  constructor(id, week, single, accumulated){
    this.id = id;
    this.week = week;
    this.single = single;
    this.accumulated = accumulated;
  }

  draw(parentNode){
    this.container = document.createElement("div");
    this.container.classList.add("container-fluid", "row");

    //this.row = document.createElement("div");
    //this.row.classList.add("row");
    //this.container.appendChild(this.row);

    this.label = document.createElement("div");
    this.label.classList.add("col-4", "col-md-3");
    this.label.innerHTML = this.week;
    this.container.appendChild(this.label);

    this.label_single = document.createElement("div");
    this.label_single.classList.add("col-4", "col-md-3");
    this.label_single.innerHTML = this.single;
    this.container.appendChild(this.label_single);

    this.label_accumulated = document.createElement("div");
    this.label_accumulated.classList.add("col-4", "col-md-3");
    this.label_accumulated.innerHTML = this.accumulated;
    this.container.appendChild(this.label_accumulated);

    parentNode.appendChild(this.container);
    //console.log(this.id +" "+this.week +" "+ this.single+" "+this.accumulated);
  }
}

var table = new DataTable("Table");