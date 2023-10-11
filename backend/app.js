import Fastify from "fastify";

const fastify = fastify({
  logger: true,
});


fastify.get('/', function  (request, reply) {
  reply.send("Hello World")
})

const port = process.env.PORT || 3000;

fastify.listen({port }, function (err, address) {
  if (err){
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`Fastify is listening on port: ${address}`);
});
