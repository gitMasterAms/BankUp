import React, { useEffect, useState } from 'react';
import './Cobranca.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from "../config/api";
import CurrencyInput from "../components/CurrencyInput";
import PercentInput from "../components/PercentInput";

function CobrancaForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    pagadorId: '',
    valor: 0,
    descricao: '',
    validade: '',
    fine_amount: 0,
    interest_rate: 0,
    days_before_due_date: 0,
    pixKey: ''
  });

  const [pagadores, setPagadores] = useState([]);

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
    if (!dia || !mes || !ano || ano.length < 4) return '';
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

      // Monta o payload com os campos corretos do backend
      const paymentData = {
        account_id: formData.pagadorId,
        amount: Number(formData.valor) || 0,
        description: formData.descricao,
        due_date: converterParaISO(formData.validade),
        pix_key: formData.pixKey,
        fine_amount: Number(formData.fine_amount) || 0,
        interest_rate: Number(formData.interest_rate) || 0,
        days_before_due_date: Number(formData.days_before_due_date) || 0
      };

      // Validação rápida no front (opcional, mas boa prática)
      if (!paymentData.account_id || !paymentData.amount || !paymentData.due_date || !paymentData.pix_key) {
        alert('Preencha todos os campos obrigatórios (Cliente, Valor, Vencimento, Chave PIX).');
        return;
      }
      
      if (isNaN(paymentData.days_before_due_date)) {
        alert('O campo "Notificar (dias antes)" deve ser um número.');
        return;
      }

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
      
      const resData = await response.json();

      if (response.ok) {
        alert(editId ? 'Cobrança atualizada com sucesso!' : 'Cobrança cadastrada com sucesso!');
        navigate('/tabela/cobrancas');
      } else {
        throw new Error(resData.msg || 'Erro ao salvar cobrança');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao salvar cobrança: ${error.message}`);
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
      
      let validadeBR = cobranca.due_date || cobranca.validade || ''; // Pega 'due_date' primeiro
      if (/^\d{4}-\d{2}-\d{2}$/.test(validadeBR)) {
        const [ano, mes, dia] = validadeBR.split('-');
        validadeBR = `${dia}/${mes}/${ano}`;
      }

      setFormData({
        pagadorId: cobranca.account_id || cobranca.pagadorId || '',
        valor: Number(cobranca.amount) || Number(cobranca.valor) || 0,
        descricao: cobranca.description || cobranca.descricao || '',
        validade: validadeBR,
        // Carrega os novos campos do objeto 'cobranca'
        fine_amount: Number(cobranca.fine_amount) || Number(cobranca.multa) || 0,
        interest_rate: Number(cobranca.interest_rate) || 0,
        days_before_due_date: 0, // Este campo não é salvo no DB, então zera ao editar
        pixKey: cobranca.pix_key || cobranca.pixKey || ''
      });
    }
  }, [location.state]);

  return (
    <div className="cobranca-form-wrapper">
      <div className="cobranca-header">
        <h1>{location.state?.editId ? "Editar Cobrança" : "Cadastro de Cobrança"}</h1>
        <p className="cobranca-tip">Preencha os dados e salve para listar na tabela.</p>
      </div>

      <div className="cobranca-form-container">
        <form onSubmit={handleSubmit} className="cobranca-form">
          <div className="form-group">
            <label>Selecionar cliente *</label>
            <select
              name="pagadorId"
              value={formData.pagadorId}
              onChange={handleInputChange}
              className="cliente-select"
              required
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
                <label>Valor *</label>
                <CurrencyInput
                  name="valor"
                  value={formData.valor}
                  onValueChange={(num) => setFormData(prev => ({ ...prev, valor: num }))}
                  placeholder="R$ 0,00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Ex: Mensalidade, Aluguel"
                />
              </div>
              
              <div className="form-group">
                <label>Chave Pix *</label>
                <input
                  type="text"
                  name="pixKey"
                  value={formData.pixKey}
                  onChange={handleInputChange}
                  placeholder="chave pix"
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Vencimento *</label>
                <input
                  type="text"
                  name="validade"
                  value={formData.validade}
                  onChange={handleInputChange}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Notificar (dias antes) *</label>
                <input
                  type="number"
                  name="days_before_due_date"
                  value={formData.days_before_due_date}
                  onChange={handleInputChange}
                  placeholder="Ex: 3"
                  min="0"
                  required
                />
              </div>
              
                <div className="form-group">
                    <label>Multa (Valor Fixo)</label>
                    <CurrencyInput
                      name="fine_amount"
                      value={formData.fine_amount}
                      onValueChange={(num) => setFormData(prev => ({ ...prev, fine_amount: num }))}
                      placeholder="R$ 0,00"
                    />
                </div>
                <div className="form-group">
                    <label>Juros (Taxa %)</label>
                    <PercentInput
                      name="interest_rate"
                      value={formData.interest_rate}
                      onValueChange={(num) => setFormData(prev => ({ ...prev, interest_rate: num }))}
                      placeholder="Ex: 1%"
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