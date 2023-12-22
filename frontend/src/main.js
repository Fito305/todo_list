const form = document.getElementById('form');
const todoNameInput = document.getElementById("todoName");
const todoAmountInput = document.getElementById("todoAmount");
const inputIndexHidden = document.getElementById("index");
form.addEventListener("submit", submitTodo);

function submitTodo(event) {
    event.preventDefault();

    let i = +form.querySelector("input[name=i]").value;
    // inputIndexHidden.value = i;

    // const currentIndex = +inputIndexHidden.value;
    const currentIndex = i;

    // get data
    if (currentIndex === -1) {
        createTodo();
    } else {
        // edit todo item with the data inform
        editTodo(currentIndex);
        inputIndexHidden.value = "-1";
    }

    todoNameInput.value = '';
    todoAmountInput.value = '';

    display();

};

function createTodo() {
    // get data
    const formTodoName = todoNameInput.value;
    const formTodoAmount = +todoAmountInput.value;
    // const i = +form.querySelector("input[name=i]").value;

    // create a new object for that data.
    const createdObject = {
        name: formTodoName,
        amount: formTodoAmount,
        completed: false
    };

    todosList.push(createdObject);

    //append that object to the array

    display();

};

function populateTodoForm(event) {
    //set the form to the current values of the clicked button item
    const i = event.target.dataset.index;
    inputIndexHidden.value = i;
    const { name, amount, completed } = todosList[i];
    todoNameInput.value = name;
    todoAmountInput.value = amount;
    //when they submit the form update the current item in the todosList 

};

function editTodo(index) {
    // get data from form
    const formTodoName = todoNameInput.value;
    const formTodoAmount = +todoAmountInput.value;
    if (formTodoName === '') return;
    // update the todo at index using the data form the form
    todosList[index].name = formTodoName;
    todosList[index].amount = formTodoAmount;

};

async function getTodos() {
    const todos = await fetch("http://localhost:3000/todos/");
    return todos;
};


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
    const res = await getTodos()
    console.log(res)
    const todos = await res.json()

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
