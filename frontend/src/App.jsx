import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [newProduto, setNewProduto] = useState({ nome: '', quantidade: 0 });

  // Fetch produtos function
  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Fetch produtos on component mount
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Create a new produto
  const createProduto = async () => {
    try {
      await axios.post('http://localhost:3000/produtos', newProduto);
      // Limpe o formulário após a criação
      setNewProduto({ nome: '', quantidade: 0 });
      // Atualize a lista de produtos após a criação
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Update an existing produto
  const updateProduto = async (id, produto) => {
    try {
      await axios.put(`http://localhost:3000/produtos/${id}`, produto);
      // Atualize a lista de produtos após a atualização
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  // Delete a produto
  const deleteProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/produtos/${id}`);
      // Atualize a lista de produtos após a exclusão
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  return (
    <div>
      <h1>Estoque</h1>
      <div>
        <h2>Criar Novo Produto</h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={newProduto.nome}
          onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço do Produto"
          value={newProduto.quantidade}
          onChange={(e) => setNewProduto({ ...newProduto, quantidade: e.target.value })}
        />
        <button onClick={createProduto}>Criar Produto</button>
      </div>
      <div>
        <h2>Lista de Produtos</h2>
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              {produto.nome} - Quantidade: {produto.quantidade}
              <button onClick={() => updateProduto(produto.id, produto)}>
                Atualizar
              </button>
              <button onClick={() => deleteProduto(produto.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
