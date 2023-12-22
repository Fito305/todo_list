const form = document.getElementById('form');
const todoNameInput = document.getElementById("todoName");
const todoAmountInput = document.getElementById("todoAmount");
const inputIndexHidden = document.getElementById("index");
form.addEventListener("submit", submitTodo);

async function submitTodo(event) {
    event.preventDefault();

    let i = +form.querySelector("input[name=i]").value;
    // inputIndexHidden.value = i;

    // const currentIndex = +inputIndexHidden.value;
    const currentIndex = i;

    // get data
    if (currentIndex === -1) {
        await createTodo();
    } else {
        // edit todo item with the data inform
        await editTodo(currentIndex);
        inputIndexHidden.value = "-1";
    }

    todoNameInput.value = '';
    todoAmountInput.value = '';

    display();

};

async function createTodo() {
    // index is -1
    // get data
    const formTodoName = todoNameInput.value;
    const formTodoAmount = +todoAmountInput.value;

    // const todos = await sanitizeTodos();

    // const i = +form.querySelector("input[name=i]").value;

    // create a new object for that data.
    const createdObject = {
        name: formTodoName,
        amount: formTodoAmount,
        completed: false
    };
    
    await fetch(`http://localhost:3000/todos/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createdObject)
    })
    //append that object to the array
    // todos.push(createdObject);
    display();
};

async function populateTodoForm(event) {
    //set the form to the current values of the clicked button item
   const todos = await sanitizeTodos();
   console.log(todos) // alot of extra arrays coming from here

    const i = event.target.dataset.index;
    inputIndexHidden.value = i;
    const { name, amount, completed } = todos[i];
    todoNameInput.value = name;
    todoAmountInput.value = amount;
    //when they submit the form update the current item in the todosList 

};



async function editTodo(index) {
     // index is not -1
     //1. Get data from form
    const formTodoName = todoNameInput.value; 
    const formTodoAmount = +todoAmountInput.value;

    const todos = await sanitizeTodos();
    console.log(todos);
   
    // 2. If the Input value is a empty string return.
    if (formTodoName === '') return;

    // if (formTodoName === todos[index].name) {
   
    // 3. update the todo at index using the data form the form
    let todoName = todos[index].name = formTodoName;        
    let todoAmount = todos[index].amount = formTodoAmount;
    console.log(todos[index]);

    //if the existing todo name has the same name as the input name feild
    // keep the existing todo at that index. Above if index "not -1" it edits
    // current todo at current index if not call createTodo.

    //TODO: The duplicate bug happens here? TODO:

    //4. I need to call the put method on the backend and update todosList // Need to add a headers: 'Content-Type': 'application/json' and stringify the body to a JSON object.

    await fetch(`http://localhost:3000/todos/`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todos[index])
    });
//   }

};

async function getTodos() {
    const todos = await fetch("http://localhost:3000/todos/");
    // console.log(todos)
    return todos;
};

async function sanitizeTodos() {
    const res = await getTodos();
    const todos = await res.json();
    // console.log(todos)
    return todos;
}

async function removeTodo(event) {
    const index = event.target.dataset.index;
    // THe querystring is ? and its sending the index to the backend to splice.
    await fetch(`http://localhost:3000/todos/?id=${index}`, {
        method: "delete",
    })
    display();
};


function markTodoComplete(event) {
    const i = event.target.dataset.index;
    // const RECLICK_TIME = 5000;
    // const TIME_SINCE_LAST_CLICK = event.timeStamp;

    todosList[i].completed = true;
    display();
    // if (TIME_SINCE_LAST_CLICK > RECLICK_TIME) {
    // event.target.addEventListener('click', markUncomplete(i));
    // }
};

function markUncomplete(event) {
    const i = event.target.dataset.index;
    todosList[i].completed = false;
    display();
};

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };
};


async function display() {
    const todos = await sanitizeTodos();

    const container = document.getElementById("container");
    removeChildren(container);

    for (let i = 0; i < todos.length; i++) {
        const { name, amount, completed } = todos[i];
        const div = document.createElement('div');
        div.classList.add("inner-container");
        const h1 = document.createElement("h1");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        h1.innerHTML = `Name: ${name}`;
        p1.innerHTML = `Amount: ${amount}`;
        p2.innerHTML = `Completed: ${completed}`;

        const editButton = document.createElement('button');
        const removeButton = document.createElement('button');
        const todoCompleteButton = document.createElement('input');
        const todoUncompleteButton = document.createElement('input');

        todoCompleteButton.type = 'radio';
        todoUncompleteButton.type = 'radio';
        editButton.innerHTML = 'Edit';
        editButton.dataset.index = i;
        removeButton.dataset.index = i;
        removeButton.innerHTML = 'Remove';
        todoCompleteButton.dataset.index = i;
        todoUncompleteButton.dataset.index = i;

        div.appendChild(h1);
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(editButton);
        div.appendChild(removeButton);
        div.appendChild(todoUncompleteButton);
        div.appendChild(todoCompleteButton);

        editButton.addEventListener("click", populateTodoForm);
        removeButton.addEventListener("click", removeTodo);
        todoCompleteButton.addEventListener("click", markTodoComplete);
        todoUncompleteButton.addEventListener("click", markUncomplete);

        container.appendChild(div);
    };

};

display();



// Bugs:
// When editing a todos at a specific index, instead of updating the current 
// existing todo, it creates a new todo. (Inside editTodo?)
