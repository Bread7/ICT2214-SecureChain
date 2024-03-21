"use strict"
const projectName = "SecureChain";

module.exports = function(fastify, opts, next) {
    fastify.get("/", async function (req, reply) {
        reply.send({
            data: {
                service: `${projectName}.services`, 
                version: "v0.0.1"
            }, 
            status: true, 
            message: "Server up!"
        })
    });
    next();
}