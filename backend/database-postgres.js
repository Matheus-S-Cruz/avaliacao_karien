import { randomUUID } from "crypto";
import { sql } from './db.js';

export class DatabasePostgres {
    
  async listProdutos() {
    const produtos = await sql`select * from produtos`;
    return produtos;
  }

  async createProduto(produto) {
    try {
        const { nome, quantidade } = produto;
        const result = await sql`
            INSERT INTO produtos (nome, quantidade)
            VALUES (${nome}, ${quantidade})
            RETURNING *
        `;
        return result[0];  // ou outro comportamento desejado
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw new Error('Produto não pôde ser criado');
    }
}

async updateProduto(id, produto) {
    const { nome, quantidade, descricao, complemento } = produto;

    await sql`
        UPDATE produtos
        SET nome = ${nome}, quantidade = ${quantidade}
        WHERE id = ${id}
    `;
}

async deleteProduto(id) {
    await sql`DELETE FROM produtos WHERE id = ${id}`;
}

}