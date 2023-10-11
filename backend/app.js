import  Fastify  from "fastify";

const fastify = Fastify({
  logger: true,
});


fastify.get('/', function  (request, reply) {
  reply.send("Felipon es un pingon!")
})

const port = process.env.PORT || 3000;

fastify.listen({port }, function (err, address) {
  if (err){
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`Fastify is listening on port: ${address}`);
});
