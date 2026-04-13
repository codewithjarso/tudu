//stores data in local storage if existant and if not starts with an emoty list
const todolist2=JSON.parse(localStorage.getItem('todolist')) || [];

// add items and due date to list
function addTodo3(){
    const inputElement=document.querySelector('.js-name-input-03');
    const dateElement=document.querySelector('.js-due-date-input');
    const element01={};
    element01.name=inputElement.value;
    element01.dueDate=dateElement.value;
    todolist2.push(element01)
    inputElement.value='';
    //saves to local storage before exiting
    localStorage.setItem('todolist',JSON.stringify(todolist2))
}

