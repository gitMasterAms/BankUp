import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";
import "../cobrança/Cobranca.css";

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
    <SidebarLayout>
      <main className="cobranca-content">
        <div className="cobranca-form-wrapper">
          <div className="cobranca-header">
            <h1>Cadastro do Pagador</h1>
            <p className="cobranca-tip">Preencha os dados e salve para listar na tabela.</p>
          </div>

          <div className="cobranca-form-container">
            <form onSubmit={handleSubmit} className="cobranca-form">
              <div className="form-fields">
                <div className="form-column">
                  <div className="form-group">
                    <label>Nome</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      placeholder="Descrição do pagador"
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>CPF/CNPJ</label>
                    <input
                      type="text"
                      name="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={handleChange}
                      placeholder="Somente números"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-salvar">SALVAR</button>
                <button type="button" className="btn-cancelar" onClick={handleCancel}>CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default CadastrarCliente;
