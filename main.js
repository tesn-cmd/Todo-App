const input = document.querySelector("#input");
const btn = document.querySelector("#add");
const itemlist = document.querySelector("#items");
const time = document.querySelector("#time");
const completeCount = document.querySelector("#completed");
const dueCount = document.querySelector("#taskDue");
btn.addEventListener("click",(e)=>{
  e.preventDefault();
  addTodo(input.value);
});
let todos = [];

function addTodo(item){
  if(item !=""){
    const todo = {
      id: Date.now(),
      name: item,
      completed:false
    };
    todos.push(todo);
    toStorage(todos);
    countDueTodo();
    input.value ="";
  }
  return false;
}
function displayTodo(todos){
  items.innerHTML ="";
  todos.forEach(todo=>{
    const checked = todo.completed?"checked":null;
    
    const li = document.createElement("li");
    li.setAttribute("id",todo.id);
    li.setAttribute("class","item");
    li.setAttribute("contentEditable",false);
    if(todo.completed===true){
      li.classList.add("checked");
    }
    li.innerHTML =`
    <input type="checkbox" class="checkbox"  ${checked} >
      <span class="text" contentEditable="false">${todo.name}</span>
    <span>
    <button class="edit">edit</button>
    <button class="remove">delete</button>
    </span>
      `;
  itemlist.append(li);
  });
}
function toStorage(todos){
  if(localStorage.getItem(todos)===""){
    todos = [];
  }
  localStorage.setItem("todos",JSON.stringify(todos));
  displayTodo(todos);
  
}
function getFromStorage(){
  const task = localStorage.getItem("todos");
  if(task){
    todos = JSON.parse(task);
    displayTodo(todos);
  }
  return false;
}

getFromStorage();
function removeTodo(id){
  todos.forEach((item,index)=>{
    if(item.id==id){
      todos.splice(index,1);
    }
    toStorage(todos);
  });
  }
function toggleCheck(id){
  todos.forEach(item=>{
  if(item.id==id){
    item.completed =!item.completed;
  }
  toStorage(todos);
  });
}

items.addEventListener("click",(e)=>{
  if(e.target.classList.contains("remove")){
    removeTodo(e.target.parentElement.parentElement.id);
    displayTodo(todos);
    
    countCompletedTodo();
    
    countDueTodo();
  }
  
  if (e.target.type==="checkbox") {
    toggleCheck(e.target.parentElement.id);
    displayTodo(todos);
    
    countCompletedTodo();
    
    countDueTodo();
  }
  //edit functionality
  if(e.target.classList.contains("edit")){
    const btn = e.target;
    const span = btn.parentNode;
    const text=span.previousElementSibling;
    //input field create
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.setAttribute("class","editor");
    inputField.value = text.textContent;
    const li = text.parentNode;
    //add input field 
    li.insertBefore(inputField,text);
    //remove span
    li.removeChild(text);
    btn.setAttribute("class","save");
    btn.textContent = "save";
    inputField.focus();
  
  //save functionality
  } else if(e.target.classList.contains("save")){
    const btn = e.target;
    const inputField = e.target.parentNode.previousElementSibling;
    //re-create span
    const span = document.createElement("span");
    span.textContent = inputField.value;
    const li = inputField.parentNode;
    //add span
    li.insertBefore(span,inputField);
    //remove input field
    li.removeChild(inputField);
    btn.textContent="edit";
    btn.setAttribute("class","edit");
    
    todos.forEach((item,index)=>{
      const id = e.target.parentNode.parentNode.id;
      if(item.id==id){
        item.name = span.textContent;
      }
   });
   toStorage(todos);
  }
});
//task completed counter
function countCompletedTodo(){
  const done = todos.filter(item=>item.completed ===true);
    completeCount.innerHTML = done.length;
    toStorage(todos);
}
countCompletedTodo();
//task due counter
function countDueTodo(){
  const due = todos.filter(item=>item.completed ===false);
    dueCount.innerHTML = due.length;
    toStorage(todos);
}
countDueTodo();
//digital clock
function getTime(){
  const now = new Date();
  sec = now.getSeconds();
  min = now.getMinutes();
  hour = now.getHours();
  session = "AM";
  
  sec = (sec <10) ?"0"+sec:sec;
  min = (min <10) ?"0"+min:min;
  hour = (hour <10) ?"0"+hour:hour;
  session = (hour<12)?"AM":"PM";
  
  let date = `${hour}:${min}:${sec} ${session}`;
  time.innerHTML = date;
  setTimeout(getTime,1000);
}
getTime();

