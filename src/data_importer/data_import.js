var users;

function selectQueryContent(value){
  switch (value){
    case 1:
      setVisible("query_content", false);
    break;
    case 2:
      setVisible("query_content", true);
      setVisible("questions_content", true);
      setVisible("users_content", false);
    break;
    case 3:
      setVisible("query_content", true);
      setVisible("questions_content", false);
      setVisible("users_content", true);
    break;
    default:
  }
}
selectQueryContent(3);

var page = document.getElementById("content");
function loadAnswer(value, index, array){
  let answer_card = document.createElement("div");
  answer_card.classList.add("mt-1");
  answer_card.classList.add("card");

  let answer_body = document.createElement("div");
  answer_body.classList.add("card-body");
  answer_card.appendChild(answer_body);

  let answer_id_container = document.createElement("div");
  answer_id_container.classList.add("input-group");
  answer_id_container.classList.add("mb-3");
  let answer_id_title_container = document.createElement("div");
  answer_id_title_container.classList.add("input-group-prepend");
  answer_id_title_container.style = "width: 90px;";
  answer_id_container.appendChild(answer_id_title_container);
  let answer_id_title = document.createElement("span");
  answer_id_title.classList.add("input-group-text");
  answer_id_title.style = "width: 90px;";
  answer_id_title.innerHTML = "Question: ";
  answer_id_title_container.appendChild(answer_id_title);
  let answer_id_input = document.createElement("label");
  answer_id_input.innerHTML = value.question.question_text;
  answer_id_input.style = "overflow: auto;";
  answer_id_input.classList.add("form-control");
  answer_id_input.setAttribute("readonly", "readonly");
  answer_id_container.appendChild(answer_id_input);

  let answer_text_container = document.createElement("div");
  answer_text_container.classList.add("input-group");
  answer_text_container.classList.add("mb-3");
  let answer_text_title_container = document.createElement("div");
  answer_text_title_container.style = "width: 90px;";
  answer_text_title_container.classList.add("input-group-prepend");
  answer_text_container.appendChild(answer_text_title_container);
  let answer_text_title = document.createElement("span");
  answer_text_title.classList.add("input-group-text");
  answer_text_title.style = "width: 90px;";
  answer_text_title.innerHTML = "Answer: ";
  answer_text_title_container.appendChild(answer_text_title);
  let answer_text_input = document.createElement("label");
  answer_text_input.style = "text-align: center;";
  answer_text_input.innerHTML = value.text;
  answer_text_input.style = "overflow: auto;";
  answer_text_input.classList.add("form-control");
  answer_text_input.setAttribute("readonly", "readonly");
  answer_text_container.appendChild(answer_text_input);

  answer_body.appendChild(answer_id_container);
  answer_body.appendChild(answer_text_container);

  page.appendChild(answer_card);
}

function compareFunction(obj1, obj2){
  return obj2.id-obj1.id;
}

function compareFunction2(obj1, obj2){
  return obj1.id-obj2.id;
}

var query = null;
function loadQuery(){
  page.innerHTML = "";
  code = document.getElementById("user_id_value").innerHTML;
  //console.log(code);
  id = getProjectId();
  if( id==undefined ){
    window.alert("Please select a valid project");
    return;
  }
  $.ajax({
    //url: serverURL + "/answers/"+code+"/"+ JSON.parse(localStorage.getItem("RESEARCHER")).id,
    url: serverURL + "/answers/"+code+"/"+ id,
    type: 'GET',
    dataType: 'json',
    success: function(data, textStatus, xhr) {     
      //console.log(data);
      if(xhr.status === 200){
        //console.log(data);
        document.getElementById("query_result").innerHTML = Object.keys(data).length + " results found";
        query = data;
        if(Object.keys(query).length === 0){          
          setVisible("query_download", false);
          //window.alert("no answers found");
        }else{       
          query.sort(compareFunction);   
          setVisible("query_download", true);          
          query.forEach(loadAnswer);        
        }
      } else {
        window.alert("an error occured");
      }
    },
    error: function(xhr, status, error) {  
      document.getElementById("query_result").innerHTML = JSON.parse(xhr.responseText);
      setVisible("query_download", false);    
      query = null;
    }   
  });
}

function clearData(node){
	node.innerHTML=null;
}

var arrayHeader=["Index", "Date", "Time", "Question", "Answer"];
function downloadQuery(){
    let delimiter = ",";
    let header = arrayHeader.join(delimiter) + '\n';
    
  	query.sort(compareFunction2);
    let data = [];
    for(var i=0; i<query.length; i++){      
      answer = query[i];     
      date = new Date(answer.createdAt);
      dateString = date.getDate() +"-"+ (date.getMonth()+1) +"-"+ date.getFullYear();
      timeString = date.getHours()+":"+date.getMinutes();
      data.push(['"'+answer.index+'"', '"'+dateString+'"', '"'+timeString+'"', '"'+answer.question.question_text+'"', '"'+answer.text+'"']);      
    }   

    let csv = header;
    data.forEach( array => {
        csv += array.join(delimiter)+"\n";
    });    

    var encoded = new TextEncoder("windows-1252",{ NONSTANDARD_allowLegacyEncoding: true }).encode(csv);

    //download encoded
    document.getElementById('download').href = "data:text/csv;charset=utf-8,%EF%BB%BF"+encodeURIComponent(csv);
    document.getElementById('download').setAttribute('download', "user_"+document.getElementById("user_id_value").innerHTML+"_answers.csv");
    document.getElementById('download').click();

    /*
    //download utf-8 csv
    csvData = new Blob([csv], {type: 'text/csv'}); 
    url = window.URL.createObjectURL(csvData);
    document.getElementById('download').href = url;
    document.getElementById('download').setAttribute('download', "user_"+document.getElementById("user_id_value").innerHTML+"_answers.csv");
    document.getElementById('download').click();
    */
}

document.querySelector('span[contenteditable="true"]').addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    });