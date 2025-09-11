import React, { useEffect, useState } from 'react';
import './Cobranca.css';
import { useLocation, useNavigate } from 'react-router-dom';

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
    pixKey: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const existentes = JSON.parse(localStorage.getItem('cobrancas') || '[]');
    const editId = location.state && location.state.editId;
    let atualizadas;
    if (editId) {
      atualizadas = existentes.map((c) => (c.id === editId ? { ...c, ...formData } : c));
    } else {
      const nova = { id: Date.now(), ...formData };
      atualizadas = [nova, ...existentes];
    }
    localStorage.setItem('cobrancas', JSON.stringify(atualizadas));
    alert(editId ? 'Cobrança atualizada com sucesso!' : 'Cobrança cadastrada com sucesso!');
    navigate('/tabela/cobrancas');
  };

  const handleCancel = () => {
    navigate('/tabela/cobrancas');
  };

  // Preencher para edição se vier editId
  useEffect(() => {
    // Carrega a lista de pagadores para o select de cliente
    const listaPagadores = JSON.parse(localStorage.getItem('pagadores') || '[]');
    setPagadores(listaPagadores);

    const editId = location.state && location.state.editId;
    if (!editId) return;
    const existentes = JSON.parse(localStorage.getItem('cobrancas') || '[]');
    const atual = existentes.find((c) => c.id === editId);
    if (atual) {
      setFormData({
        pagadorId: atual.pagadorId || '',
        valor: atual.valor || '',
        descricao: atual.descricao || '',
        validade: atual.validade || '',
        multa: atual.multa || '',
        pixKey: atual.pixKey || ''
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
                <option key={p.id} value={p.id}>{p.nome} {p.cpfCnpj ? `- ${p.cpfCnpj}` : ''}</option>
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
