import Fastify from "fastify";
import cors from '@fastify/cors'


//TODO: added the id property 
const todosList = [
    {
        id: 1,
        name: 'calls',
        amount: 5,
        completed: false,
    },
    {
        id: 2,
        name: 'appointment',
        amount: 10,
        completed: false,
    },
    {
        id: 3,
        name: 'followUps',
        amount: 15,
        completed: false,
    },
    {
        id: 4,
        name: 'closing',
        amount: 6,
        completed: false,
    }
];


const fastify = Fastify({
    logger: true,
});

// https://github.com/fastify/fastify-cors
await fastify.register(cors, {
    origin: "http://127.0.0.1:8080"
})

fastify.get('/', (request, reply) => {
    reply.send("Hola Mundo")
})


fastify.get('/todos/', (request, reply) => {
    reply.send(todosList)
})


fastify.post('/todos/', async (req, res) => {
    const newTodo = await req.body;
    todosList.push(newTodo);
    res.send("POST");
})


fastify.put('/todos/', async (req, res) => {
    try {
        const updatedTodo = await req.body;
        // todo.id is always = 1 is loop
        for (const todo of todosList) {
            console.log(todo, "todo.id", updatedTodo, "updatedTodo.id line 66")
            if (todo.id == updatedTodo.id){
                console.log(todo, "[todo] line 69")
                // todosList[todo] = updatedTodo;
                // todo = updatedTodo;
                // console.log(todo, "todo before push")
                // todo = updatedTodo;
                console.log(todosList, "todosList")
                todosList.splice(todo, 1, updatedTodo)
            } else {
                console.log(todo, "else todosList[todo] line 76")
                todosList[todo] = todo;
                
            }
        // The duplicate is occuring here because if just pushing the new todo to the end.
        // todosList.push(updatedTodos)
        // i have to remove the old todo and replace it with the new one
        }
        res.send("PUT");
    } catch (error) {
        console.log(error);
        return res.send("There was an error catch", error)
    }
})


fastify.delete('/todos/', (request, reply) => {
    // start at at the index, delete one element
    const  id  = request.query.id;
    console.log(id, "---------Debug--------")

    const todoIndex = todosList[id];
    
    // for (const todo in todosList) {
        // if (todo.id === id) {
    // Removes the todo below the todo im actually trying to delete.
        todosList.splice(todoIndex, 1);
        // }
    // }
    reply.send('delete')
})

const port = process.env.PORT || 3000;

fastify.listen({ port }, function(err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }

    fastify.log.info(`Fastify is listening on port: ${address}`);
});


    //TODO: THE BODY LOGIC MAKES SENSE FOR PUT METHOD NOT HERE
    // get todo from body
    // // for t in todoslist
    // for (const todo in todosList) {
    // //  if t.id === todo.id
    //     if (todo.id === newTodo.id) {
    // //      todolist[t] = todo
    //         todosList[todo].push(newTodo);
    // } else {
    // //   else old one
    //     todosList[todo] = todoList[todo];
    // }

