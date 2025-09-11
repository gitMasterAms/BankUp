import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Componente de menu lateral
import "./CadClientes.css"; // Estilos específicos para esta página (arquivo está na mesma pasta)
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";

/**
 * Componente CadastrarCliente - Formulário para cadastro de novos clientes
 * 
 * Este componente renderiza um formulário completo para cadastro de clientes,
 * incluindo sidebar de navegação e layout responsivo.
 * 
 * Funcionalidades:
 * - Formulário com validação de campos
 * - Integração com sidebar de navegação
 * - Layout responsivo com sidebar
 * - Categorização de clientes (Aluguel, Serviço, Produto)
 * - Campos para dados pessoais e de contato
 */
function CadastrarCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",           // Nome completo do cliente
    descricao: "",      // Descrição do pagador
    cpfCnpj: "",        // CPF ou CNPJ do cliente
    email: "",          // Email de contato
    telefone: ""        // Telefone de contato
  });

  const handleCancel = () => {
    navigate('/tabela/pagadores');
  };

  // Se vier um editId via navegação, preencher o formulário
  React.useEffect(() => {
    const editId = location.state && location.state.editId;
    if (!editId) return;
    
    const fetchPagador = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/financial/recurring/${editId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setFormData({
          nome: data.name || "",
          descricao: data.description || "",
          cpfCnpj: data.cpf_cnpj || "",         
          email: data.email || "",          
          telefone: data.phone || "",
        });
      } catch (error) {
        console.error('Erro ao buscar pagador:', error);
      }
    };

    fetchPagador();
  }, [location.state]);

  /**
   * Função para atualizar os valores do formulário conforme o usuário digita
   * @param {Event} e - Evento de mudança no input
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Função para lidar com o envio do formulário
   * Atualmente apenas exibe os dados no console e mostra alerta de sucesso
   * @param {Event} e - Evento de submit do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const editId = location.state && location.state.editId;
    
    // Validação básica dos campos obrigatórios
    if (!formData.nome || !formData.cpfCnpj || !formData.email || !formData.telefone) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const pagadorData = {
      name: formData.nome,
      description: formData.descricao || '', // Garante que description não seja undefined
      cpf_cnpj: formData.cpfCnpj,
      email: formData.email,
      phone: formData.telefone
    };

    try {
      const token = localStorage.getItem('token');
      const url = editId ? `${API_URL}/financial/recurring/${editId}` : `${API_URL}/financial/recurring`;
      const response = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagadorData)
      });

      if (response.ok) {
        alert(editId ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
        navigate("/tabela/pagadores");
      } else {
        const errorData = await response.json();
        console.error('Erro do servidor:', errorData);
        throw new Error(errorData.msg || 'Erro ao salvar pagador');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao salvar pagador: ${error.message}`);
    }
  };

  return (
    <div className="page-with-sidebar">
      {/* Componente de menu lateral */}
      <Sidebar />
      
      {/* Área principal do conteúdo */}
      <div className="main-content">
        <div className="cadastro-container">
          {/* Título da página */}
          <h2>Dados do Cliente</h2>
          
          {/* Informação explicativa para o usuário */}
          <p className="info">
            Ao criar um cliente você deve criar uma cobrança para que este receba a
            notificação devida
          </p>

          {/* Formulário de cadastro */}
          <form className="form-cadastro" onSubmit={handleSubmit}>
            {/* Primeira linha: Nome e Categoria */}
            <div className="form-row">
              <input
                type="text"
                name="nome"
                placeholder="Nome Completo"
                value={formData.nome}
                onChange={handleChange}
              />
            
            </div>

            {/* Descrição */}
            <div className="form-row">
              <input
                type="text"
                name="descricao"
                placeholder="Descrição"
                value={formData.descricao}
                onChange={handleChange}
              />
            </div>

            {/* Segunda linha: CPF/CNPJ */}
            <div className="form-row">
              <input
                type="text"
                name="cpfCnpj"
                placeholder="CPF/CNPJ"
                value={formData.cpfCnpj}
                onChange={handleChange}
              />
            </div>

            {/* Terceira linha: Email */}
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Quarta linha: Telefone */}
            <div className="form-row">
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>

            {/* Botões de ação do formulário */}
            <div className="form-actions">
              <button type="submit" className="btn-salvar">Salvar</button>
              <button type="button" className="btn-cancelar" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastrarCliente;
