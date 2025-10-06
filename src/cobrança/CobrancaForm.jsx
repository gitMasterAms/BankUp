import React, { useEffect, useState } from 'react';
import './Cobranca.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from "../config/api";
 
function CobrancaForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    pagadorId: '',
    valor: '',
    descricao: '',
    validade: '',
    multa: '',
    pixKey: ''
  });
 
  const [pagadores, setPagadores] = useState([]);
 
  // Função para formatar data como dd/mm/aaaa ao digitar
  const formatarDataInput = (value) => {
    const numeric = value.replace(/\D/g, '');
    let formatted = '';
    if (numeric.length <= 2) {
      formatted = numeric;
    } else if (numeric.length <= 4) {
      formatted = `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
    } else {
      formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(4, 8)}`;
    }
    return formatted;
  };
 
  // Função para converter dd/mm/aaaa para yyyy-mm-dd
  const converterParaISO = (data) => {
    const [dia, mes, ano] = data.split('/');
    if (!dia || !mes || !ano) return '';
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };
 
  // Atualiza o state com máscara no campo de data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
 
    const newValue = name === 'validade'
      ? formatarDataInput(value)
      : value;
 
    setFormData(prev => ({
      ...prev,
      [name]: newValue
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
        due_date: converterParaISO(formData.validade),
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
 
  useEffect(() => {
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
 
    const editState = location.state;
    if (editState && editState.editId && editState.cobranca) {
      const { cobranca } = editState;
      // Converter data americana para brasileira se necessário
      let validadeBR = cobranca.validade || '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(validadeBR)) {
        const [ano, mes, dia] = validadeBR.split('-');
        validadeBR = `${dia}/${mes}/${ano}`;
      }
      setFormData({
        pagadorId: cobranca.pagadorId || '',
        valor: cobranca.valor || '',
        descricao: cobranca.descricao || '',
        validade: validadeBR,
        multa: cobranca.multa || '',
        pixKey: cobranca.pixKey || ''
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
                <label>Vencimento</label>
                <input
                  type="text"
                  name="validade"
                  value={formData.validade}
                  onChange={handleInputChange}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
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
            </div>
          </div>
 
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