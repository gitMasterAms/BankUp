import React, { useState } from "react";
import Sidebar from "./components/Sidebar"; // Componente de menu lateral
import "./styles/CadClientes.css"; // Estilos específicos para esta página

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
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",           // Nome completo do cliente
    categoria: "Aluguel", // Categoria padrão (Aluguel, Serviço, Produto)
    cpfCnpj: "",        // CPF ou CNPJ do cliente
    cep: "",            // CEP do endereço
    email: "",          // Email de contato
    endereco: "",       // Endereço completo
    telefone: ""        // Telefone de contato
  });

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
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    console.log("Cliente cadastrado:", formData); // Log dos dados para debug
    alert("Cliente cadastrado com sucesso!"); // Feedback visual para o usuário
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
                required // Campo obrigatório
              />
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="Aluguel">Aluguel</option>
                <option value="Serviço">Serviço</option>
                <option value="Produto">Produto</option>
              </select>
            </div>

            {/* Segunda linha: CPF/CNPJ e CEP */}
            <div className="form-row">
              <input
                type="text"
                name="cpfCnpj"
                placeholder="CPF/CNPJ"
                value={formData.cpfCnpj}
                onChange={handleChange}
                required // Campo obrigatório
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                required // Campo obrigatório
              />
            </div>

            {/* Terceira linha: Email e Endereço */}
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required // Campo obrigatório
              />
              <input
                type="text"
                name="endereco"
                placeholder="Endereço (Cidade, Bairro, Número)"
                value={formData.endereco}
                onChange={handleChange}
                required // Campo obrigatório
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
                required // Campo obrigatório
              />
            </div>

            {/* Botões de ação do formulário */}
            <div className="form-actions">
              <button type="submit" className="btn-salvar">Salvar</button>
              <button type="button" className="btn-cancelar">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastrarCliente;
