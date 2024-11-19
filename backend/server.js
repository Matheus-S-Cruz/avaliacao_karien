
import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { DatabasePostgres } from './database-postgres.js';

const server = fastify();
const databasePostgres = new DatabasePostgres;

// CORS
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

// CREATE
server.post('/produtos', async (request, reply) => {
    const body = request.body;
    let error = {};

    if (!body.nome) {
        error.nome = 'Valor nome não foi informado.';
    }

    if (!body.quantidade) {
        error.quantidade = 'Valor quantidade não foi informado.';
    }

    if (Object.keys(error).length === 0) {
        try {
            await databasePostgres.createProduto(body);
            return reply.status(201).send();
        } catch (err) {
            console.error('Erro ao criar produto:', err);
            return reply.status(500).send({ message: 'Erro interno ao criar produto', error: err.message });
        }        
    } else {
        return reply.status(400).send(error);
    }
});

// READE
server.get('/produtos', async () => {
    const produtos = await databasePostgres.listProdutos();
    return produtos;
});

// UPDATE
server.put('/produtos/:id', async (request, reply) => {
    const produtoID = request.params.id;
    const body = request.body;
  

    let error = {};

    if(!body.nome){
        error.nome = 'Valor nome não foi informado.'

    } if (!body.quantidade){
        error.quantidade = 'Valor quantidade não foi informado.'
    }
    if(body.nome && body.quantidade && produtoID){
        await databasePostgres.updateProduto(produtoID, body);
        return reply.status(201).send();

    }else{
        return reply.status(400).send(error);

    }
})

// DELETE
server.delete('/produtos/:id', async (request, reply) => {
    const produtoID = request.params.id;
    await databasePostgres.deleteProduto(produtoID); // Alterado para deleteProduto

    return reply.status(204).send();
});

server.listen({
    port: 3000
});