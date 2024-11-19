import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [newProduto, setNewProduto] = useState({ nome: '', quantidade: 0 });
  const [editingProduto, setEditingProduto] = useState(null); // Estado para controle de edição

  // Função para buscar produtos
  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Buscar produtos ao montar o componente
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Criar um novo produto
  const createProduto = async () => {
    try {
      await axios.post('http://localhost:3000/produtos', newProduto);
      setNewProduto({ nome: '', quantidade: 0 });
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Atualizar um produto existente
  const updateProduto = async () => {
    try {
      await axios.put(`http://localhost:3000/produtos/${editingProduto.id}`, newProduto);
      setEditingProduto(null); // Limpar o estado de edição após a atualização
      setNewProduto({ nome: '', quantidade: 0 }); // Limpar o formulário
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  // Iniciar a edição de um produto
  const editProduto = (produto) => {
    setEditingProduto(produto); // Definir o produto como sendo editado
    setNewProduto({ nome: produto.nome, quantidade: produto.quantidade }); // Preencher os campos com os dados do produto
  };

  // Excluir um produto
  const deleteProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/produtos/${id}`);
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  return (
    <div>
      <h1>Estoque</h1>
      <div>
        <h2>{editingProduto ? 'Atualizar Produto' : 'Criar Novo Produto'}</h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={newProduto.nome}
          onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantidade do Produto"
          value={newProduto.quantidade}
          onChange={(e) => setNewProduto({ ...newProduto, quantidade: e.target.value })}
        />
        <button onClick={editingProduto ? updateProduto : createProduto}>
          {editingProduto ? 'Salvar Alterações' : 'Criar Produto'}
        </button>
      </div>
      <div>
        <h2>Lista de Produtos</h2>
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              {produto.nome} - Quantidade: {produto.quantidade}
              <button onClick={() => editProduto(produto)}>Editar</button>
              <button onClick={() => deleteProduto(produto.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;