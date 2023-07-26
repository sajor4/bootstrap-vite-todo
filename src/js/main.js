import '../scss/styles.scss'

import * as bootstrap from 'bootstrap'

import { DBService } from '../../services/db-service'

import { Manager } from '../../model/manager'

import { Todo } from '../../model/todo'

document.getElementById('btn-order-title').addEventListener('click', () => orderByTitle());
document.getElementById('btn-order-date').addEventListener('click', () => orderByDate());
document.getElementById('add-todo-btn').addEventListener('click', () => addTodo());


let manager;

DBService.getAllTodos().then(todos => {
    manager = new Manager(todos);
    render();
})


function render(){
    
    const todoContainer=document.getElementById('todo-container'); 
    todoContainer.innerHTML= '';

    for (let i = 0; i < manager.todoArray.length; i++) {

        const todo = manager.todoArray[i];

        const div = document.createElement('div');
        div.classList.add('card');

        const div2 = document.createElement('div');
        div2.classList.add('card-body');

        

        // const titleStrong=document.createElement('strong');
        // const titleNode=document.createTextNode(todo.title);

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title text-capitalize';
        const titleNode = document.createTextNode(todo.title);

        cardTitle.appendChild(titleNode);
        div.appendChild(cardTitle);
        
        const dateSpan=document.createElement('h6');
        dateSpan.className = 'card-subtitle mb-2 fs-6';
        const dateNode = document.createTextNode(todo.creationDate.toISOString());

        dateSpan.appendChild(dateNode);
        div.appendChild(dateSpan);

        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-primary btn-sm';
        const completeNode = document.createTextNode( todo.isCompleted ? 'da completare' : 'completato');
        completeBtn.addEventListener('click', () => {

            const modifiedTodo = {...todo};

            if (modifiedTodo.isCompleted === true) {
                modifiedTodo.isCompleted = false;
            } else {
                modifiedTodo.isCompleted = true;
            }

            DBService.updateTodo(modifiedTodo).then(res => {
                manager.changeCompleteStatus(i);
                render();
            })
            
        });

        completeBtn.appendChild(completeNode);
        div.appendChild(completeBtn);

        if(todo.isCompleted){
            // div.style.borderColor='lime';
            div.style.backgroundColor='green';
            div.style.color='white';
            completeBtn.style.backgroundColor = 'yellow';
        }


        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        const deleteNode = document.createTextNode('cancella');
        deleteBtn.addEventListener('click', () => {

            DBService.deleteTodo(todo.id).then(() => {
                manager.deleteTodo(i);
                render();
            });
                        
        });
    
        deleteBtn.appendChild(deleteNode);
        div.appendChild(deleteBtn);


        todoContainer.appendChild(div);
    }
}

function orderByTitle(){
    manager.orderTodosByTitle();
    render();
}

function orderByDate(){
    manager.orderTodosByDate();
    render();
}

///1) aggiungere il tasto cancella su ogni todo
///2) aggiungere la possibilità di aggiungere todo alla lista 
//////tramite una input e un bottone aggiungi 

function addTodo(){
    const input = document.getElementById('add-todo-input')
    const newTodoTitle = input.value;
    if(newTodoTitle.trim() !== ''){

        const newTodo = new Todo(newTodoTitle, false, new Date());

        DBService.saveTodo(newTodo).then(res => {
            manager.addTodo(res);
            input.value = '';
            render();
        })
    }
}