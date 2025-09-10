import React, { useEffect, useState } from 'react';
import './Cobranca.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from "../config/api";

function CobrancaForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    // pagadorId é necessário para o backend relacionar a cobrança ao cliente
    // Preenchemos via select abaixo a partir de localStorage("pagadores")
    pagadorId: '',
    valor: '',
    descricao: '',
    validade: '',
    multa: '',
    pixKey: '',
    jurosMes: ''
  });

  // Lista de clientes (pagadores) para popular o select
  const [pagadores, setPagadores] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const editId = location.state && location.state.editId;
      
      const paymentData = {
        account_id: formData.pagadorId,
        amount: parseFloat(formData.valor),
        description: formData.descricao,
        due_date: formData.validade,
        pix_key: formData.pixKey,
        penalty: parseFloat(formData.multa)
      };

      const url = editId 
        ? `${API_URL}/financial/payments/${editId}`
        : `${API_URL}/financial/payments`;

      const response = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        alert('Cobrança cadastrada com sucesso!');
        navigate('/tabela/cobrancas');
      } else {
        throw new Error('Erro ao cadastrar cobrança');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar cobrança');
    }
  };

  const handleCancel = () => {
    navigate('/tabela/cobrancas');
  };

  // Preencher para edição se vier editId
  useEffect(() => {
    // Carrega a lista de pagadores da API
    const fetchPagadores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/financial/recurring`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPagadores(data.map(item => ({
          id: item.account_id,
          nome: item.name,
          cpfCnpj: item.cpf_cnpj
        })));
      } catch (error) {
        console.error('Erro ao buscar pagadores:', error);
        setPagadores([]);
      }
    };

    fetchPagadores();
    
    // Se houver estado de edição, preencher o formulário
    const editState = location.state;
    if (editState && editState.editId && editState.cobranca) {
      const { cobranca } = editState;
      setFormData({
        pagadorId: cobranca.pagadorId || '',
        valor: cobranca.valor || '',
        descricao: cobranca.descricao || '',
        validade: cobranca.validade || '',
        multa: cobranca.multa || '',
        pixKey: cobranca.pixKey || '',
        jurosMes: cobranca.jurosMes || ''
      });
    }
  }, [location.state]);

  return (
    <div className="cobranca-form-wrapper">
      <div className="cobranca-header">
        <h1>Cadastro de Cobrança</h1>
        <p className="cobranca-tip">Preencha os dados e salve para listar na tabela.</p>
      </div>

      <div className="cobranca-form-container">
        <form onSubmit={handleSubmit} className="cobranca-form">
          {/* Seleção do cliente (pagador) - necessário para o backend associar a cobrança */}
          <div className="form-group">
            <label>Selecionar cliente</label>
            <select
              name="pagadorId"
              value={formData.pagadorId}
              onChange={handleInputChange}
              className="cliente-select"
            >
              <option value="">-- Selecione --</option>
              {pagadores.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* Campos do formulário essenciais para cobrança */}

          {/* Campos do formulário */}
          <div className="form-fields">
            <div className="form-column">
              <div className="form-group">
                <label>Valor</label>
                <input 
                  type="text" 
                  name="valor" 
                  value={formData.valor}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input 
                  type="text" 
                  name="descricao" 
                  value={formData.descricao}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Até a data (validade)</label>
                <input 
                  type="text" 
                  name="validade" 
                  value={formData.validade}
                  onChange={handleInputChange}
                  placeholder="dd/mm/aaaa"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Multa</label>
                <input 
                  type="text" 
                  name="multa" 
                  value={formData.multa}
                  onChange={handleInputChange}
                  placeholder="ex.: 2%"
                />
              </div>

              <div className="form-group">
                <label>PixKey</label>
                <input 
                  type="text" 
                  name="pixKey" 
                  value={formData.pixKey}
                  onChange={handleInputChange}
                  placeholder="chave pix"
                />
              </div>

              <div className="form-group">
                <label>Juros ao mês</label>
                <input 
                  type="text" 
                  name="jurosMes" 
                  value={formData.jurosMes}
                  onChange={handleInputChange}
                  placeholder="ex.: 1%"
                />
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="form-actions">
            <button type="submit" className="btn-salvar">
              SALVAR
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancel}>
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CobrancaForm;
