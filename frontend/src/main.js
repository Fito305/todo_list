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
    // console.log(currentId)
    // dataset hidden input
        // console.log(inputIndexHidden.value)
        // get data
        // // was currentId === -1
        //// iden =dataset.id and id = -1
        if (currentId === -1) {
            console.log(currentId, "Gets called when id = -1");
              createTodo();
        }
        else {
            // edit todo item with the data inform
            console.log(currentId, "Gets called when id is not -1");
             editTodo(currentId);
             // const todos = await getTodos();
             // display();
            inputIndexHidden.value = "-1";
            // console.log(inputIndexHidden)
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

//TODO:  START HERE!!!!!!! Its a helper function.
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

    // create a new object for that data.
    // //TODO: added the new Date().getTime() to generate random number for id
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
    //append that object to the array
    // todos.push(createdObject);
    display();
};

async function populateInputName(event) {
    //set the form to the current values of the clicked button item
    //TODO: this changed
    const identification = event.target.dataset.id;
    // console.log(identification)
    const todo = await getTodoById(identification);
    if (!todo) return;
    // console.log(todo)
    const { name, amount, completed, id } = todo;
    // console.log(name)
    inputName.value = name;
    inputAmount.value = amount;
    inputIndexHidden.value = id;
    // console.log(inputIndexHidden)
    //when they submit the form update the current item in the todosList 
};



async function editTodo(index) {
    console.log(index);
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
    console.log(todo.name)
    todo.amount = formTodoAmount;
    console.log(todo.amount)
    todo.id = identification;
    console.log(todo)

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

//BUG: The remove function targets the right dataset.id but deletes the todo below it.
async function removeTodo(event) {
    const id = event.target.dataset.id;
    console.log(id)
    const todo = await getTodoById(id); // returns a boolean
    console.log(todo.id)
    const todoId = todo.id;
    console.log(todoId)
    // THe querystring is ? and its sending the index to the backend to splice.
    await fetch(`http://localhost:3000/todos/?id=${todoId}`, {
        method: "delete",
    })
    display();
};


function markTodoComplete(event) {
    const i = event.target.dataset.id;
    // const RECLICK_TIME = 5000;
    // const TIME_SINCE_LAST_CLICK = event.timeStamp;
    todosList[i].completed = true;
    display();
    // if (TIME_SINCE_LAST_CLICK > RECLICK_TIME) {
    // event.target.addEventListener('click', markUncomplete(i));
    // }
};

function markUncomplete(event) {
    //TODO: recently added
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

    //TODO: recently added
    for (const todo of todos) {
        //TODO: Recently added! Im destructuring the `id` from the todos here
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
        //TODO: added the destructured `id` to the dataset
        editButton.dataset.id = id;
        removeButton.dataset.id = id;
        removeButton.innerHTML = 'Remove';

        //TODO: added the destructured `id` to the dataset
        todoCompleteButton.dataset.id = id;
        todoUncompleteButton.dataset.id = id;

        // Added this
        // form.dataset.id = id;
        // subBtn.dataset.id = id;

        //TODO: the `id` will equal the number of each todosList `id` property

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

        // Moved this from global scope to inside the scope of this for loop.
        // form.addEventListener("submit", submitTodo)
        
        container.appendChild(div);
    };
};

display();

// Bugs:
// When editing a todos at a specific index, instead of updating the current 
// existing todo, it creates a new todo. (Inside editTodo?)
