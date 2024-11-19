import { fastify } from 'fastify'; // Importa o Fastify, que é um framework web rápido e leve para Node.js.
import cors from '@fastify/cors'; // Importa o plugin de CORS do Fastify, necessário para permitir requisições de diferentes origens.
import { DatabasePostgres } from './database-postgres.js'; // Importa a classe DatabasePostgres, que gerencia a interação com o banco de dados PostgreSQL.

const server = fastify(); // Cria uma instância do servidor Fastify.
const databasePostgres = new DatabasePostgres(); // Cria uma instância da classe DatabasePostgres para interação com o banco de dados.


// Configuração do CORS
server.register(cors, {
    origin: '*', // Permite requisições de qualquer origem (útil durante o desenvolvimento, mas pode ser restrito em produção).
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Permite apenas os métodos HTTP GET, POST, PUT e DELETE.
});

// Rota CREATE (POST) para criar um novo produto
server.post('/produtos', async (request, reply) => {
    const body = request.body; // Obtém o corpo da requisição, que deve conter os dados do produto a ser criado.
    let error = {}; // Variável para armazenar os erros de validação.

    // Validações para garantir que 'nome' e 'quantidade' foram enviados no corpo da requisição.
    if (!body.nome) {
        error.nome = 'Valor nome não foi informado.'; // Se 'nome' não estiver presente, adiciona um erro.
    }

    if (!body.quantidade) {
        error.quantidade = 'Valor quantidade não foi informado.'; // Se 'quantidade' não estiver presente, adiciona um erro.
    }

    // Se não houver erros de validação, tenta criar o produto no banco de dados.
    if (Object.keys(error).length === 0) {
        try {
            await databasePostgres.createProduto(body); // Chama o método createProduto da classe DatabasePostgres para inserir o produto no banco.
            return reply.status(201).send(); // Retorna um status HTTP 201 para indicar que o produto foi criado com sucesso.
        } catch (err) {
            console.error('Erro ao criar produto:', err); // Caso ocorra um erro no banco de dados, loga o erro.
            return reply.status(500).send({ message: 'Erro interno ao criar produto', error: err.message }); // Retorna um erro 500 com uma mensagem de erro.
        }        
    } else {
        return reply.status(400).send(error); // Se houver erros de validação, retorna um erro 400 com os erros.
    }
});

// Rota READ (GET) para listar todos os produtos
server.get('/produtos', async () => {
    const produtos = await databasePostgres.listProdutos(); // Chama o método listProdutos da classe DatabasePostgres para recuperar todos os produtos.
    return produtos; // Retorna a lista de produtos.
});

// Rota UPDATE (PUT) para atualizar um produto existente
server.put('/produtos/:id', async (request, reply) => {
    const produtoID = request.params.id; // Obtém o ID do produto a ser atualizado da URL.
    const body = request.body; // Obtém o corpo da requisição com os novos dados do produto.
    
    let error = {}; // Variável para armazenar erros de validação.

    // Validações para garantir que 'nome' e 'quantidade' estão presentes no corpo da requisição.
    if(!body.nome){
        error.nome = 'Valor nome não foi informado.'; // Se o nome não foi informado, adiciona um erro.
    }
    if (!body.quantidade){
        error.quantidade = 'Valor quantidade não foi informado.'; // Se a quantidade não foi informada, adiciona um erro.
    }

    // Se o produtoID, nome e quantidade estiverem presentes, atualiza o produto no banco de dados.
    if(body.nome && body.quantidade && produtoID){
        await databasePostgres.updateProduto(produtoID, body); // Chama o método updateProduto da classe DatabasePostgres para atualizar o produto.
        return reply.status(201).send(); // Retorna status 201 para indicar que o produto foi atualizado com sucesso.
    } else {
        return reply.status(400).send(error); // Se houver erros de validação, retorna um erro 400 com os erros encontrados.
    }
});

// Rota DELETE para excluir um produto
server.delete('/produtos/:id', async (request, reply) => {
    const produtoID = request.params.id; // Obtém o ID do produto a ser excluído da URL.
    await databasePostgres.deleteProduto(produtoID); // Chama o método deleteProduto da classe DatabasePostgres para excluir o produto do banco de dados.

    return reply.status(204).send(); // Retorna status 204 para indicar que o produto foi excluído com sucesso (sem conteúdo na resposta).
});

// Inicia o servidor Fastify na porta 3000
server.listen({
    port: 3000 // Define a porta em que o servidor irá escutar as requisições.
});
