const form = document.getElementById('form');
const inputName = document.getElementById("todoName");
const inputAmount = document.getElementById("todoAmount");
const inputIndexHidden = document.getElementById("id");
// const subBtn = document.getElementById("submitBtn");
// console.log(subBtn)

form.addEventListener("submit", submitTodo)


async function submitTodo(event) {
    event.preventDefault();
    // This is the hidden input vvalue of the hidden input is value="-1"
    let currentId = +form.querySelector("input[name=i]").value;
    // dataset hidden input
        // get data
        if (currentId === -1) {
            console.log(currentId, "Gets called when id = -1");
              createTodo();
        }
        else {
            // edit todo item with the data inform
            console.log(currentId, "Gets called when id is not -1");
             editTodo(currentId);
            inputIndexHidden.value = "-1";
        }
    inputName.value = '';
    inputAmount.value = '';
    display();
};


async function getTodos() {
    const res = await fetch("http://localhost:3000/todos/");
    const todos = await res.json();
    return todos;
};

async function getTodoById(id) {
    const todos = await getTodos();
    return todos.find((todo) => {
        console.log(todo.id == id);  // returns a boolean
        return todo.id == id;
    });
};

async function createTodo() {
    // get data
    const formName = inputName.value;
    const formAmount = +inputAmount.value;

    const newTodo = {
        id: new Date().getTime(),
        name: formName,
        amount: formAmount,
        completed: false
    };

    await fetch(`http://localhost:3000/todos/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
    })
    display();
};

async function populateInputName(event) {
    //set the form to the current values of the clicked  edit button 
    const identification = event.target.dataset.id;
    const todo = await getTodoById(identification);
    if (!todo) return;
    const { name, amount, completed, id } = todo;
    inputName.value = name;
    inputAmount.value = amount;
    inputIndexHidden.value = id;
};



async function editTodo(index) {
    // The index is the dataset.id
    // index is not -1
    //1. Get data from form
    let formTodoName = inputName.value;
    let formTodoAmount = +inputAmount.value;


    let identification = index;
    const todo = await getTodoById(identification);
    // 2. If the Input value is a empty string return.
    if (formTodoName === '') return;
    // 3. update the todo at index using the data form the form
    todo.name = formTodoName;
    todo.amount = formTodoAmount;
    todo.id = identification;

    //4. I need to call the put method on the backend and update todosList // Need to add a headers: 'Content-Type': 'application/json' and stringify the body to a JSON object.
    await fetch(`http://localhost:3000/todos/`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    });

    display();
};

async function removeTodo(event) {
    const id = event.target.dataset.id;
    console.log(id)
    const todo = await getTodoById(id); // returns a boolean
    console.log(todo.id)
    const todoId = todo.id;
    console.log(todoId)
    // The querystring is ? and its sending the index to the backend to splice.
    await fetch(`http://localhost:3000/todos/?id=${todoId}`, {
        method: "delete",
    })
    display();
};


function markTodoComplete(event) {
    const i = event.target.dataset.id;
    todosList[i].completed = true;
    display();
};

function markUncomplete(event) {
    const id = event.target.dataset.id;
    todosList[id].completed = false;
    display();
};

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };
};


async function display() {
    const todos = await getTodos();

    const container = document.getElementById("container");
    removeChildren(container);

    for (const todo of todos) {
        const { name, amount, completed, id } = todo;
        const div = document.createElement('div');
        div.classList.add("inner-container");
        const h1 = document.createElement("h1");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const p3 = document.createElement("p")
        h1.innerHTML = `Name: ${name}`;
        p1.innerHTML = `Amount: ${amount}`;
        p2.innerHTML = `Completed: ${completed}`;
        p3.innerHTML = `Identification: ${id}`;

        const editButton = document.createElement('button');
        const removeButton = document.createElement('button');
        const todoCompleteButton = document.createElement('input');
        const todoUncompleteButton = document.createElement('input');

        todoCompleteButton.type = 'radio';
        todoUncompleteButton.type = 'radio';
        editButton.innerHTML = 'Edit';
        // Added the destructured `id` to the dataset
        editButton.dataset.id = id;
        removeButton.dataset.id = id;
        removeButton.innerHTML = 'Remove';

        //Added the destructured `id` to the dataset
        todoCompleteButton.dataset.id = id;
        todoUncompleteButton.dataset.id = id;

        //The `id` will equal the number of each todosList `id` property

        div.appendChild(h1);
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(editButton);
        div.appendChild(removeButton);
        div.appendChild(todoUncompleteButton);
        div.appendChild(todoCompleteButton);

        editButton.addEventListener("click", populateInputName);
        removeButton.addEventListener("click", removeTodo);
        todoCompleteButton.addEventListener("click", markTodoComplete);
        todoUncompleteButton.addEventListener("click", markUncomplete);

        
        container.appendChild(div);
    };
};

display();

