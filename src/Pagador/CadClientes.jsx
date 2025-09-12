import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout"; // Layout com sidebar responsiva
import "./CadClientes.css"; // Estilos específicos para esta página (arquivo está na mesma pasta)
import { useNavigate, useLocation } from "react-router-dom";

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

  // Se vier um editId via navegação, preencher o formulário
  React.useEffect(() => {
    const editId = location.state && location.state.editId;
    if (!editId) return;
    const existentes = JSON.parse(localStorage.getItem("pagadores") || "[]");
    const atual = existentes.find((p) => p.id === editId);
    if (atual) {
      setFormData({
        nome: atual.nome || "",
        descricao: atual.descricao || "",
        cpfCnpj: atual.cpfCnpj || "",
        email: atual.email || "",
        telefone: atual.telefone || "",
      });
    }
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
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    // Persistir no localStorage (criar ou atualizar) e voltar para a tabela
    const existentes = JSON.parse(localStorage.getItem("pagadores") || "[]");
    const editId = location.state && location.state.editId;
    let atualizados;
    if (editId) {
      atualizados = existentes.map((p) =>
        p.id === editId
          ? { ...p, nome: formData.nome, descricao: formData.descricao, cpfCnpj: formData.cpfCnpj, email: formData.email, telefone: formData.telefone }
          : p
      );
    } else {
      const novo = {
        id: Date.now(),
        nome: formData.nome,
        descricao: formData.descricao,
        cpfCnpj: formData.cpfCnpj,
        email: formData.email,
        telefone: formData.telefone,
      };
      atualizados = [novo, ...existentes];
    }
    localStorage.setItem("pagadores", JSON.stringify(atualizados));
    alert(editId ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
    navigate("/tabela/pagadores");
  };

  return (
    <SidebarLayout>
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
              <button type="button" className="btn-cancelar">Cancelar</button>
            </div>
          </form>
        </div>
    </SidebarLayout>
  );
}

export default CadastrarCliente;
