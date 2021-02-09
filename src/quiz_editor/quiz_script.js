var quiz;

var page = document.getElementById("quiz_editor");
var modalShowButton = document.getElementById("removeItemModalToggle");

var questionCount = 0;
function loadQuestion(value, index, array){
  index = ++questionCount;
  let question = document.createElement("div");
  question.classList.add("strong-borders");
  question.classList.add("well-rounded");
  question.classList.add("card");
  question.id = "question_"+index;

  let question_header = document.createElement("div");
  question_header.id = "header_"+value.id;
  question_header.classList.add("card-header");
  question_header.classList.add("mt-1");

  let question_title = document.createElement("h5");
  let question_title_button = document.createElement("button");
  question_title_button.classList.add("btn");
  question_title_button.classList.add("btn-link");
  //if(index !=0)
    question_title_button.classList.add("collapsed");
  question_title_button.setAttribute("type", "button");
  question_title_button.setAttribute("data-toggle", "collapse");
  question_title_button.setAttribute("data-target", "#collapse_"+index);
  question_title_button.innerHTML = "Question "+ (index);
  question_title_button.classList.add("info-text");
  question_title_button.classList.add("changed");

  question_title.appendChild(question_title_button);
  question_header.appendChild(question_title);
  question.appendChild(question_header);

  let question_delete_button = document.createElement("button");
  question_delete_button.innerHTML = "X";
  //question_delete_button.classList.add("btn btn-danger");
  question_delete_button.setAttribute("type", "button");
  question_delete_button.classList.add("btn");
  question_delete_button.classList.add("btn-danger");
  question_delete_button.classList.add("float-right");
  question_delete_button.setAttribute("data-toggle", "modal");
  question_delete_button.setAttribute("data-target", "#removeItemModal");
  question_delete_button.onclick = function(event){
    event.stopPropagation();
    removeQuestion(value, parseInt(question_title_button.innerHTML.split(' ')[1]), question);
    modalShowButton.click();
  };
  question_title.appendChild(question_delete_button);

  let question_body_container = document.createElement("div");
  question_body_container.id = "collapse_"+index;
  question_body_container.classList.add("mt-1");
  question_body_container.classList.add("collapse");
  //if(index == 1)
  //  question_body_container.classList.add("show");
  question_body_container.setAttribute("data-parent", "#quiz_editor");
  
  let question_body = document.createElement("div");
  question_body.classList.add("card-body");
  question_body.classList.add("form-group");
  question_body_container.appendChild(question_body);

  let question_id_container = document.createElement("div");
  question_id_container.style = "display: none;";
  //question_id_container.classList.add("input-group");
  //question_id_container.classList.add("mb-3");
  let question_id_title_container = document.createElement("div");
  //question_id_title_container.classList.add("input-group-prepend");
  //question_id_title_container.style = "width: 70px;";
  question_id_container.appendChild(question_id_title_container);
  let question_id_title = document.createElement("label");
  //question_id_title.classList.add("input-group-text");
  //question_id_title.classList.add("changed");
  //question_id_title.style = "width: 70px;";
  //question_id_title.innerHTML = "ID: ";
  question_id_title_container.appendChild(question_id_title);
  let question_id_input = document.createElement("label");
  question_id_input.id = "question_id_"+index;
  question_id_input.innerHTML = value.id;
  //question_id_input.classList.add("form-control");
  //question_id_input.setAttribute("readonly", "readonly");
  question_id_container.appendChild(question_id_input);

  let question_text_container = document.createElement("div");
  question_text_container.classList.add("input-group");
  question_text_container.classList.add("mb-3");
  let question_text_title_container = document.createElement("div");
  question_text_title_container.style = "width: 70px;";
  question_text_title_container.classList.add("input-group-prepend");
  question_text_container.appendChild(question_text_title_container);
  let question_text_title = document.createElement("label");
  question_text_title.classList.add("input-group-text");
  question_text_title.classList.add("changed");
  question_text_title.style = "width: 70px;";
  question_text_title.innerHTML = "Text: ";
  question_text_title_container.appendChild(question_text_title);
  let question_text_input = document.createElement("input");
  question_text_input.id = "question_text_"+index;
  //question_text_input.style = "text-align: center;";
  question_text_input.placeholder = value.question_text;
  question_text_input.onfocus = function(){
    if(!this.value){
      this.value = this.placeholder;      
    }
  };
  question_text_input.onblur = function(){
    if(this.value == this.placeholder){
      this.placeholder = this.value;
      this.value = null;      
    } else if(!this.classList.contains("changed")){
      this.classList.add("changed");
    }
  };
  question_text_input.type = "text";
  question_text_input.classList.add("form-control");
  question_text_container.appendChild(question_text_input);

  let question_type_container = document.createElement("div");
  question_type_container.classList.add("input-group");
  question_type_container.classList.add("mb-3");
  let question_type_title_container = document.createElement("div");
  question_type_title_container.classList.add("input-group-prepend");
  question_type_title_container.style = "width: 70px;";
  question_type_container.appendChild(question_type_title_container);
  let question_type_title = document.createElement("label");
  question_type_title.classList.add("input-group-text");
  question_type_title.classList.add("changed");
  question_type_title.style = "width: 70px;";
  question_type_title.innerHTML = "Type: ";
  question_type_title_container.appendChild(question_type_title);
  let question_type_combobox = document.createElement("select");
  question_type_combobox.id = "question_type_"+index;
  question_type_combobox.classList.add("form-control");
  question_type_combobox.onchange = function(){ 
    questionTypeOnChange(index, this.value);   
    if(!this.classList.contains("changed"))
      this.classList.add("changed"); 
  };
  let question_type_option_disabled = document.createElement("option");
  question_type_option_disabled.disabled = true;
  question_type_option_disabled.innerHTML = "Choose option";
  let question_type_option_text = document.createElement("option");
  question_type_option_text.value = "Text";
  question_type_option_text.innerHTML = "Text";
  let question_type_option_slider = document.createElement("option");
  question_type_option_slider.value = "Slider";
  question_type_option_slider.innerHTML = "Slider";
  question_type_container.appendChild(question_type_combobox);
  question_type_combobox.appendChild(question_type_option_disabled);
  question_type_combobox.appendChild(question_type_option_text);
  question_type_combobox.appendChild(question_type_option_slider);
  
  let question_levels_container = document.createElement("div");
  question_levels_container.id = "levels_container_" + index;
  question_levels_container.style = "display: none;";
  question_levels_container.classList.add("input-group");
  question_levels_container.classList.add("mb-3");
  let question_levels_title_container = document.createElement("div");
  question_levels_title_container.classList.add("input-group-prepend");
  question_levels_title_container.style = "width: 70px;";
  question_levels_container.appendChild(question_levels_title_container);
  let question_levels_title = document.createElement("label");
  question_levels_title.classList.add("input-group-text");
  question_levels_title.classList.add("changed");
  question_levels_title.style = "width: 70px;";
  question_levels_title.innerHTML = "Levels: ";
  question_levels_title_container.appendChild(question_levels_title);
  let question_levels_combobox = document.createElement("select");
  question_levels_combobox.id = "question_levels_"+index;
  question_levels_combobox.classList.add("form-control");
  question_levels_combobox.onchange = function(){ 
    if(!this.classList.contains("changed"))
      this.classList.add("changed"); 
  };
  let question_levels_option_disabled = document.createElement("option");
  question_levels_option_disabled.disabled = true;
  question_levels_option_disabled.innerHTML = "Choose option";
  let question_levels_option_0 = document.createElement("option");
  question_levels_option_0.value = "0";
  question_levels_option_0.innerHTML = "% Percentage";
  let question_levels_option_3 = document.createElement("option");
  question_levels_option_3.value = "3";
  question_levels_option_3.innerHTML = "3 levels";  
  let question_levels_option_5 = document.createElement("option");
  question_levels_option_5.value = "5";
  question_levels_option_5.innerHTML = "5 levels";  
  question_levels_container.appendChild(question_levels_combobox);
  question_levels_combobox.appendChild(question_levels_option_disabled);
  question_levels_combobox.appendChild(question_levels_option_0);
  question_levels_combobox.appendChild(question_levels_option_3);
  question_levels_combobox.appendChild(question_levels_option_5);

  let question_options_container = document.createElement("div");
  question_options_container.id = "question_options_"+index;
  question_options_container.classList.add("container");
  let question_options = document.createElement("div");
  question_options.classList.add("card");  
  let question_options_header = document.createElement("label");
  question_options_header.classList.add("card-header");
  question_options_header.classList.add("changed");
  question_options_header.innerHTML = "Question Options:";
  let question_options_body = document.createElement("div");
  question_options_body.classList.add("card-body");
  question_options_body.classList.add("form-group");
  question_options_body.style = "padding-bottom: 0px";
  question_options_body.id = "question_options_body_list_"+index;
  if(value.question_options)
    value.question_options.sort(compareFunction);
  loadQuestionOptions(question_options_body, value.question_options);

  let question_options_footer_container = document.createElement("div");
  question_options_footer_container.classList.add("card-footer");

  let question_options_footer = document.createElement("div");
  question_options_footer.classList.add("row");
  question_options_footer.classList.add("justify-content-md-center");
  question_options_footer_container.appendChild(question_options_footer);

  let add_question_option_container = document.createElement("div"); 
  add_question_option_container.classList.add("col-md-12");
  add_question_option_container.classList.add("col-lg-auto");
  add_question_option_container.classList.add("d-flex");
  add_question_option_container.classList.add("justify-content-center");
  add_question_option_container.classList.add("vertical-center-contained");
  let add_question_option = document.createElement("button");
  add_question_option.classList.add("mb-2");
  add_question_option.classList.add("ml-3");
  add_question_option.classList.add("btn");
  add_question_option.classList.add("btn-secondary");
  add_question_option.innerHTML="+";
  add_question_option.onclick = function(){
    sendAddQuestioOption(question_options_body, value.id, document.getElementById("question_options_body_list_"+index).childElementCount);
  };  
  add_question_option_container.appendChild(add_question_option);
  question_options_footer.appendChild(add_question_option_container);

  let switch_container = document.createElement("span");
  switch_container.classList.add("col-md-12");
  switch_container.classList.add("col-lg-auto");
  switch_container.classList.add("text-center");
  switch_container.classList.add("vertical-center-contained");
  switch_container.classList.add("mb-2");
  let switch_title = document.createElement("span");
  switch_title.classList.add("ml-3");
  switch_title.classList.add("mr-3");
  switch_title.innerHTML = "Horizontal? ";
  let switch_input = document.createElement("input");
  switch_input.id = "horizontal_orientation_"+index;
  switch_input.setAttribute("type", "checkbox");
  if(value.orientation === "Vertical"){
    switch_input.checked = false;
  } else{
    switch_input.checked = true;    
  }
  switch_input.onchange = function(){ 
    if(!this.classList.contains("changed"))   
      this.classList.add("changed");
  }; 
  switch_container.appendChild(switch_title);
  switch_container.appendChild(switch_input);
  question_options_footer.appendChild(switch_container);

  let switch_container2 = document.createElement("span");
  switch_container2.classList.add("col-md-12");
  switch_container2.classList.add("col-lg-auto");
  switch_container2.classList.add("text-center");
  switch_container2.classList.add("vertical-center-contained");
  switch_container2.classList.add("mb-2");
  let switch_title2 = document.createElement("span");
  switch_title2.classList.add("ml-3");
  switch_title2.classList.add("mr-2");
  switch_title2.innerHTML = "Request reason? ";
  let switch_input2 = document.createElement("input");
  switch_input2.id = "request_reason_"+index;
  switch_input2.setAttribute("type", "checkbox");
  if(value.request_reason){
    switch_input2.checked = true;
  } else{
    switch_input2.checked = false;    
  }
  switch_input2.onchange = function(){ 
    if(!this.classList.contains("changed"))   
      this.classList.add("changed");
  };  
  switch_input2.setAttribute("value", switch_input2.checked);
  switch_container2.appendChild(switch_title2);
  switch_container2.appendChild(switch_input2);
  question_options_footer.appendChild(switch_container2);

  question_options.appendChild(question_options_header);
  question_options.appendChild(question_options_body);
  question_options.appendChild(question_options_footer_container);
  question_options_container.appendChild(question_options);

  question_body.appendChild(question_id_container);
  question_body.appendChild(question_text_container);
  question_body.appendChild(question_type_container);
  question_body.appendChild(question_levels_container);
  question_body.appendChild(question_options_container);

  question.appendChild(question_body_container);
  page.appendChild(question);

  if(value.question_type == "Text"){
    question_type_combobox.selectedIndex = 1;
    questionTypeOnChange(index, "Text");
  }else if(value.question_type == "Slider"){
    question_type_combobox.selectedIndex = 2;
    questionTypeOnChange(index, "Slider");
  }

  if(value.levels == "0")
    question_levels_combobox.selectedIndex = 1;
  else if(value.levels == "3")
    question_levels_combobox.selectedIndex = 2;
  else if(value.levels == "5")
    question_levels_combobox.selectedIndex = 3;
}

function loadQuestionOptions(question_options_container, options){
	if(!options)
		return;
	options.sort(compareFunction);
	for (var i = 0; i < options.length; i++) {
	    addQuestionOption(question_options_container, options[i], (i));
	}
}

function questionTypeOnChange(id, value){
  switch (value){
    case "Text":
      setVisible("question_options_"+id, true);
      setVisible("levels_container_"+id, false);
    break;
    case "Slider":
      setVisible("question_options_"+id, false);
      setVisible("levels_container_"+id, "flex");
    break;
    default:
  }
}

function addQuestionOption(question_options, data, index){
  let question_text_container = document.createElement("div");
  question_text_container.classList.add("input-group");
  question_text_container.classList.add("mb-3");
  let question_text_title_container = document.createElement("div");
  //question_text_title_container.style = "width: 50px;";  
  question_text_title_container.classList.add("input-group-prepend");
  question_text_container.appendChild(question_text_title_container);
  
  let question_text_title = document.createElement("label");
  question_text_title.classList.add("input-group-text");
  question_text_title.classList.add("changed");
  question_text_title_container.style = "display:none;";
  //question_text_title.style = "width: 50px;";
  question_text_title.innerHTML = data.id;
  question_text_title.id = "question_option_"+data.questionId+"_"+index;
  question_text_title_container.appendChild(question_text_title);
  let question_text_input = document.createElement("input");
  question_text_input.id = "question_option_value_"+ data.id;
  question_text_input.placeholder = data.option;
  question_text_input.onfocus = function(){
    if(!this.value){
      this.value = this.placeholder;
    }
  };
  question_text_input.onblur = function(){
    if(this.value == this.placeholder){
      this.placeholder = this.value;
      this.value = null;      
    }else if(!this.classList.contains("changed")){
      this.classList.add("changed");
    }
  };
  question_text_input.type = "text";
  question_text_input.classList.add("form-control");
  question_text_container.appendChild(question_text_input);
  let option_delete_container = document.createElement("div");
  option_delete_container.classList.add("input-group-append");
  question_text_container.appendChild(option_delete_container);
  let option_text = document.createElement("button");
  option_text.classList.add("input-group-text");
  option_text.classList.add("btn");
  option_text.classList.add("btn-danger");
  option_text.innerHTML = "X";
  option_text.onclick = function(){
    sendDeleteQuestionOption(question_text_container, data.id);
  };  
  option_delete_container.appendChild(option_text);

  question_options.appendChild(question_text_container);
}

function sendDeleteQuestionOption(node, id){
  $.ajax({
      url: serverURL + "/questions/options/" + id,
      type: 'DELETE',
      dataType: 'json',
      success: function(data, textStatus, xhr) {0
        if(xhr.status === 200){
          node.parentNode.removeChild(node);
        } else {
          window.alert("couldn't delete question option");
        }
      }
  });    
}

function sendAddQuestioOption(question_options, id, index){
  $.ajax({
    url: serverURL + "/questions/options/" + id,
    type: 'POST',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);     
        addQuestionOption(question_options, data, index);
      } else {
        window.alert("couldn't add question option");
      }
    }
  });
}

function compareFunction(obj1, obj2){
  return obj1.id-obj2.id;
}

function loadQuestions(){
  quiz.sort(compareFunction);
  quiz.forEach(loadQuestion);
}

model = {};
function addQuestion(){
  sendAddQuestion();
}
function sendAddQuestion(){
  let project_id = getProjectId();
  if(project_id === undefined){
    window.alert("Please select a valid project");
    return;
  }
  $.ajax({
    url: serverURL + "/questions/" + project_id,
    type: 'POST',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);     
        loadQuestion(data);
      } else {
        window.alert("couldn't add user");
      }
    }
  });
}

function loadQuiz(){
  id = getProjectId();
  if(id === undefined){
    //window.alert("Please select a valid project");
    return;
  }
  questionCount = 0;
  $.ajax({
    url: serverURL + "/questions/" + id,
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {
      if(xhr.status === 200){
        //console.log(data);
        quiz = data;
        loadQuestions();
      } else {
        window.alert("couldn't load users");
      }
    }
  });
}

function removeQuestion(value, index, questionObj){
  let modal = document.getElementById("removeItemModal");
  let modalTItle = document.getElementById("removeItemModalTitle");
  modalTItle.innerHTML = "Do you want to delete question: " + (index) +" with id: "+value.id+"?";
  let modalBody = document.getElementById("removeItemModalBody");
  modalBody.innerHTML = value.question_text;
  let modalAccept = document.getElementById("removeItemModalAccept");
  modalAccept.onclick = function(){
    sendDeleteQuestion(value.id, questionObj);
    modalShowButton.click();
  };  
}

function sendDeleteQuestion(id, node){
  $.ajax({
      url: serverURL + "/questions/" + id,
      type: 'DELETE',
      dataType: 'json',
      success: function(data, textStatus, xhr) {0
        if(xhr.status === 200){
          node.parentNode.removeChild(node);
        } else {
          window.alert("couldn't delete question");
        }
      }
  });
}

function sendUpdateOption(node, id, value){
    $.ajax({
      url: serverURL + "/questions/options/" + parseInt(id),
      type: 'PATCH',
      dataType: 'json',
      data: {"question_option": value},
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          node.classList.remove("changed");
        } else {
          window.alert("couldn't update option");
        }
      }
    });
}

function saveQuestion(index){
  let id_input = document.getElementById("question_id_" +index);
  let text_input = document.getElementById("question_text_" +index);
  let type_input = document.getElementById("question_type_" +index);
  let levels_input = document.getElementById("question_levels_" +index);
  let question_options = document.getElementById("question_options_body_list_"+index);

  let changes = {};
  if (text_input.value != ""){
    changes.question_text = text_input.value; 
  }
  if (type_input.classList.contains("changed")){
    changes.question_type = type_input.value; 
  }  
  if (levels_input.classList.contains("changed")){
    changes.levels = levels_input.value; 
  }  

  for(var i=0; i<question_options.childElementCount; i++){     
    var option_id = document.getElementById("question_option_" + id_input.innerHTML+"_"+(i));
    var option_input = document.getElementById("question_option_value_" + option_id.innerHTML);
    if(option_input.classList.contains("changed")){
      sendUpdateOption(option_input, option_id.innerHTML, option_input.value);
      //console.log(option_input.value);
    }
  }

  let checkbox = document.getElementById("horizontal_orientation_"+index);
  if(checkbox.classList.contains("changed"))
    if(checkbox.checked){
      changes.orientation = "Horizontal";
    }else{
      changes.orientation = "Vertical";
    }

  let checkbox2 = document.getElementById("request_reason_"+index);
  if(checkbox2.classList.contains("changed"))
    changes.request_reason = checkbox2.checked; 

  if(Object.keys(changes).length === 0)
    return;
  //console.log(changes);

  $.ajax({
      url: serverURL + "/questions/" + parseInt(id_input.innerHTML),
      type: 'PATCH',
      dataType: 'json',
      data: {"question_text": changes.question_text, "question_type": changes.question_type, "levels": changes.levels, "orientation": changes.orientation, "request_reason": changes.request_reason},
      success: function(data, textStatus, xhr) {
        if(xhr.status === 200){
          if(changes.question_text){
            text_input.placeholder = text_input.value;          
            text_input.value = null;
            text_input.classList.remove("changed");
          }
          if(changes.question_type)
            type_input.classList.remove("changed");
          if(changes.levels)
            levels_input.classList.remove("changed"); 
          if(changes.orientation)
            checkbox.classList.remove("changed");
          if(changes.request_reason)
            checkbox2.classList.remove("changed");
        } else {
          window.alert("couldn't update question");
        }
      }
    });
}

function saveQuestions(){
	for(var i=1; i<=questionCount; i++){
		let id_input = document.getElementById("question_id_" +i);
		if(id_input)
			saveQuestion(i);
	}
}

$( document ).ready(function() {
  loadQuiz();
});

projectSelector.onchange = function(){
  projectId = this.value;
  page.innerHTML = "";
  loadQuiz();
}