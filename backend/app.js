import  Fastify  from "fastify";
import cors from '@fastify/cors'



const todosList = [
    {
        name: 'calls',
        amount: 5,
        completed: false,
    },
    {
        name: 'appointment',
        amount: 10,
        completed: false,
    },
    {
        name: 'followUps',
        amount: 15,
        completed: false,
    },
    {
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

fastify.get('/', function  (request, reply) {
  reply.send("Felipon El Pingon")
})


fastify.get('/todos/', function  (request, reply) {
  reply.send(todosList)
})


fastify.delete('/todos/', function (request, reply) {
    todosList.splice(request.query.id, 1);
    reply.send('delete')
})

const port = process.env.PORT || 3000;

fastify.listen({port }, function (err, address) {
  if (err){
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`Fastify is listening on port: ${address}`);
});
