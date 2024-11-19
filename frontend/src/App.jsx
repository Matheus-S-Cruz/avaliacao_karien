import { useState, useEffect } from 'react';  // Importação dos hooks useState e useEffect do React
import axios from 'axios';  // Importação da biblioteca axios para realizar requisições HTTP

function App() {
  // Declaração do estado do componente
  const [produtos, setProdutos] = useState([]);  // Estado para armazenar a lista de produtos
  const [newProduto, setNewProduto] = useState({ nome: '', quantidade: 0 });  // Estado para armazenar os dados do novo produto a ser criado ou editado
  const [editingProduto, setEditingProduto] = useState(null); // Estado para controle de edição de produto

  // Função para buscar a lista de produtos no backend
  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/produtos');  // Faz uma requisição GET para obter os produtos
      setProdutos(response.data);  // Atualiza o estado 'produtos' com os dados recebidos
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);  // Trata qualquer erro durante a requisição
    }
  };

  // useEffect é executado quando o componente é montado, ou seja, logo após a renderização inicial
  useEffect(() => {
    fetchProdutos();  // Chama a função para buscar os produtos quando o componente for montado
  }, []);  // O array vazio [] faz com que o useEffect seja executado apenas uma vez, na montagem inicial

  // Função para criar um novo produto
  const createProduto = async () => {
    try {
      await axios.post('http://localhost:3000/produtos', newProduto);  // Envia uma requisição POST para criar o produto no backend
      setNewProduto({ nome: '', quantidade: 0 });  // Limpa o formulário após a criação do produto
      fetchProdutos();  // Atualiza a lista de produtos após a criação
    } catch (error) {
      console.error('Erro ao criar produto:', error);  // Trata qualquer erro durante a criação
    }
  };

  // Função para atualizar um produto existente
  const updateProduto = async () => {
    try {
      // Envia uma requisição PUT para atualizar o produto no backend
      await axios.put(`http://localhost:3000/produtos/${editingProduto.id}`, newProduto);
      setEditingProduto(null);  // Limpa o estado de edição após a atualização
      setNewProduto({ nome: '', quantidade: 0 });  // Limpa o formulário após a atualização
      fetchProdutos();  // Atualiza a lista de produtos após a atualização
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);  // Trata qualquer erro durante a atualização
    }
  };

  // Função chamada ao clicar em "Editar" para carregar os dados do produto a ser editado no formulário
  const editProduto = (produto) => {
    setEditingProduto(produto);  // Define o produto como o item que está sendo editado
    setNewProduto({ nome: produto.nome, quantidade: produto.quantidade });  // Preenche o formulário com os dados do produto
  };

  // Função para excluir um produto
  const deleteProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/produtos/${id}`);  // Envia uma requisição DELETE para excluir o produto
      fetchProdutos();  // Atualiza a lista de produtos após a exclusão
    } catch (error) {
      console.error('Erro ao excluir produto:', error);  // Trata qualquer erro durante a exclusão
    }
  };

  return (
    <div>
      <h1>Estoque</h1>
      <div>
        <h2>{editingProduto ? 'Atualizar Produto' : 'Criar Novo Produto'}</h2>  {/* Exibe título dependendo se está criando ou editando */}
        <input
          type="text"
          placeholder="Nome do Produto"
          value={newProduto.nome}  // Mostra o nome do produto no input
          onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })} // Atualiza o nome do produto ao digitar
        />
        <input
          type="number"
          placeholder="Quantidade do Produto"
          value={newProduto.quantidade} // Mostra a quantidade do produto no input
          onChange={(e) => setNewProduto({ ...newProduto, quantidade: e.target.value })} // Atualiza a quantidade ao digitar
        />
        <button onClick={editingProduto ? updateProduto : createProduto}>  {/* Chama updateProduto se estiver editando, caso contrário chama createProduto */}
          {editingProduto ? 'Salvar Alterações' : 'Criar Produto'}  {/* Altera o texto do botão dependendo do estado de edição */}
        </button>
      </div>
      <div>
        <h2>Lista de Produtos</h2>
        <ul>
          {produtos.map((produto) => (  // Mapeia a lista de produtos e exibe cada um 
            <li key={produto.id}>
              {produto.nome} - Quantidade: {produto.quantidade}  {/* Exibe o nome e quantidade do produto */}
              <button onClick={() => editProduto(produto)}>Editar</button>  {/* Chama a função editProduto ao clicar */}
              <button onClick={() => deleteProduto(produto.id)}>Excluir</button>  {/* Chama a função deleteProduto ao clicar */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
