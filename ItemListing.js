class ItemListing{

  addLabel(title, label, labelOnBlurFunc, container){
    let titleObj = document.createElement("span");
    if(title) 
      titleObj.innerHTML = title;  
    titleObj.style = "overflow: auto;"
    titleObj.classList.add("mr-2", "changed");

    let titleEditableObj = document.createElement("span");
    titleEditableObj.classList.add("mt-2");
    if(label)
      titleEditableObj.innerHTML = label;
    titleEditableObj.contentEditable = true;
    if(labelOnBlurFunc){
      titleEditableObj.onblur = function (){
        labelOnBlurFunc(data.id, titleEditableObj.innerHTML);
      }
    }
    titleObj.appendChild(titleEditableObj);
    container.appendChild(titleObj);

    return titleObj;
  }

  addContentAddButton(container, onClickFunc, id){
    let btn_container = document.createElement("div");
    btn_container.classList.add("container", "p-1" , "my-1");
    let button = document.createElement("button");
    button.classList.add("btn", "btn-info");
    button.innerHTML = "+";
    button.onclick = function(){
      onClickFunc(container, id);
    }
    btn_container.appendChild(button);

    container.appendChild(btn_container);
  }

  constructor(data, index, list){
    const obj = this;
    this.data = data;

    this.container = document.createElement("div");
    this.container.classList.add("card", "mt-2", "p-2");

    // add card header
    this.container_header = document.createElement("div");
    this.container_header.classList.add("card-header");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("ml-2", "btn", "btn-danger", "float-right");
    deleteButton.innerHTML = "x";

    let headerTitleObj = this.addLabel(data.headerTitle, data.headerTitleEditable, data.headerTitleEditableOnBlurFunc, this.container_header);

    //add delete button callback
    if(data.deleteButtonFunc){
      deleteButton.onclick = function(){
        if (confirm("Are you sure you want to delete this: " + data.headerTitle + "?\n")){ //+ headerTitleObj.headerTitleEditable.innerHTML)) {
          data.deleteButtonFunc(data.id, obj.container);
        }
      }
    }

    this.container_header.appendChild(deleteButton);
    this.container.appendChild(this.container_header);
    
    // add card body
    this.container_body = document.createElement("div");
    this.container_body.classList.add("card-body");
    
    let bodyTitleObj = this.addLabel(data.bodyContent, data.bodyContentEditable, data.bodyContentEditableOnBlurFunc, this.container_body);

    if(data.content){
      for(var i=0; i<data.content.length; i++)
        data.addContentFunc(data.content[i], data.id, this.container_body);
    }
    if(data.hasContentAddButton){
      this.addContentAddButton(this.container_body, data.addContentCallback, data.id);
    }

    this.container.appendChild(this.container_body);

    list.appendChild(this.container);
  }
}