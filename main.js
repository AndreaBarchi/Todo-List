//Selectors
const task_input = document.querySelector('.task_input');
const add_button = document.querySelector('.add_button');
const delete_button = document.querySelector('.delete_button');
const checklist_list = document.querySelector('.checklist_list');
const task_type_selection = document.querySelector('.task_type');
const task_order = document.querySelector('.task_order');

//Variables
let day = new Date().getDate();
let month = parseInt(new Date().getMonth())+1;
let date = day + "/" + month; 

//Event Listeners
document.addEventListener('DOMContentLoaded', getLocalTasks());
add_button.addEventListener('click', createTask);
checklist_list.addEventListener('click', taskInteraction);
task_order.addEventListener('change', sortTasks);


function createTask(event){
    event.preventDefault();
    if(task_input.value != ""){
        //Add task to local storage
        //Array structure ["task_id","task_type","task_text","completed","date"]
        saveLocalTasks(task_type_selection.value, task_input.value, false, date); 
        getLocalTasks();
        task_input.value = "";
    }
}

function taskInteraction(e){
    const item = e.target;
    const task = item.parentElement;
    if(item.classList[0] === "delete_button"){
        task.classList.remove('move_in');
        task.classList.add('move_away');
        task.addEventListener('transitionend', function(){
            deleteLocalTasks(task.id);
        });
    }
    if(item.classList[0] === "task_checkbox"){
        checklist_list.appendChild(task);
        checkTask(task.id);
    }
}

function checkTask(task_id){
    let tasks = [];
    if(localStorage.getItem('tasks') !== null){
        tasks = JSON.parse(localStorage.getItem('tasks'));
        let taskIndex = tasks.findIndex(task => task.id == task_id);
        if(tasks[taskIndex].completed == true){
            tasks[taskIndex].completed = false;
            console.log("Unchecking task with id: " + task_id);
        }
        else{
            tasks[taskIndex].completed = true;
            console.log("Checking task with id: " + task_id);
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        getLocalTasks();
    }
}

function saveLocalTasks(task_type, task_text, completed, date){
    //Check if item already exists
    let tasks = [];
    let newTask;
    if(localStorage.getItem('tasks') === null){
        //Array structure ["task_id","task_type","task_text","completed","date"]
        tasks = [];
    }
    else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    let task_id = tasks.length;
    newTask = {id: task_id, type: task_type, text: task_text, completed: completed, date: date};
    console.log(newTask);
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteLocalTasks(task_id){
    let tasks = [];
    if(localStorage.getItem('tasks') !== null){
        tasks = JSON.parse(localStorage.getItem('tasks'));
        let updatedTasks = tasks.filter(task => task.id != task_id);
        console.log("deleting task with id: " + task_id);
        console.log(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        getLocalTasks();
    }
}

function getLocalTasks(task){
    checklist_list.innerHTML = null;
    let task_orderby = localStorage.getItem('tasks_sortby');
    let tasks = [];
    let day = new Date().getDate();
    let month = parseInt(new Date().getMonth())+1;
    let date = day + "/" + month;
    if(task_orderby != null){
        task_order.value = task_orderby;
    } 
    if(localStorage.getItem('tasks') !== null){
        tasks = (JSON.parse(localStorage.getItem('tasks')));
        let updatedTasks = [];
        switch(task_order.value){
            case "All":
                tasks.forEach(task => {
                    updatedTasks.push(task);
                });
                break;
            case "Completed":
                tasks.forEach(task => {
                    if (task.completed){
                        updatedTasks.push(task);
                    }
                });
                break;
            case "Not Completed":
                tasks.forEach(task => {
                    if (!task.completed){
                        updatedTasks.push(task);
                    }
                });
                break;
            case "Standard":
                tasks.forEach(task => {
                    if (task.type == "Standard"){
                        updatedTasks.push(task);
                    }
                });
                break;
            case "Daily":
                tasks.forEach(task => {
                    if (task.type == "Daily"){
                        updatedTasks.push(task);
                    }
                });
                break;
        }
        console.log(updatedTasks);
        updatedTasks.forEach(task => {
            console.log("Rendering task: " + task.id + " of type: " + task.type + " with text: " + task.text + " completed: " + task.completed + " on date: " + task.date);
            const tasksDiv = document.createElement('div');
            tasksDiv.classList.add('task');
            tasksDiv.id = task.id;
            
            const newTask = document.createElement('li');
            newTask.innerText = task.type + ": " + task.text;
            newTask.classList.add('tasks_item');
    
            tasksDiv.appendChild(newTask);  

            const taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.classList.add('task_checkbox');
            if(task.completed){
                if(task.date == date){
                    taskCheckbox.checked = true;
                }
                else{
                    task.completed = false;
                }
            }
            tasksDiv.appendChild(taskCheckbox);
        
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete";
            deleteButton.classList.add('delete_button');
            tasksDiv.appendChild(deleteButton);
            checklist_list.appendChild(tasksDiv); 
        });
        //localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
}

function sortTasks(){
    localStorage.setItem('tasks_sortby', task_order.value);
    getLocalTasks();
}
