import Fastify from "fastify";
import cors from '@fastify/cors'

const todosList = [];

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
        const updatedTodo = await req.body;
        const idx = todosList.findIndex(todo => todo.id === updatedTodo.id)
        if (idx === -1) {
            throw new Error('todo index not found');
        }
        todosList[idx] = updatedTodo;
        res.send("PUT");
})

fastify.delete('/todos/', (request, reply) => {
    const  todoId  = +request.query.id;
    const idx = todosList.findIndex( todo => todo.id === todoId)
    if (idx === -1){
        throw new Error("Index not found")
    }
    todosList.splice(idx, 1);
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
