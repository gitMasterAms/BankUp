import React, { useState } from 'react';
import './Cobranca.css';

function CobrancaForm() {
  const [formData, setFormData] = useState({
    cliente: 'Gabrielle Gualberto Carvalheiro Bastida',
    formaPagamento: 'Pix',
    intervalo: 'Mensal',
    dataVencimento: '11/09/2025 às 23:59:59',
    juros: '1',
    valorFixo: '15,00',
    dataFim: '13/09/2025 às 23:59:59',
    valorFim: '0.05'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados da cobrança:', formData);
    // Aqui você pode adicionar a lógica para salvar os dados
  };

  const handleCancel = () => {
    // Aqui você pode adicionar a lógica para cancelar
    console.log('Cobrança cancelada');
  };

  return (
    <div className="cobranca-form-wrapper">
      <div className="cobranca-header">
        <h1>Defina sua cobrança para seu cliente</h1>
        <p className="cobranca-tip">
          Para modificar sua cobrança mais rápido vá em clientes e selecione seu cliente
        </p>
      </div>

      <div className="cobranca-form-container">
        <form onSubmit={handleSubmit} className="cobranca-form">
          {/* Seção do cliente */}
          <div className="cliente-section">
            <div className="cliente-avatar">
              <div className="avatar-placeholder">👤</div>
            </div>
            <div className="cliente-info">
              <label>Selecione seu cliente</label>
              <select 
                name="cliente" 
                value={formData.cliente}
                onChange={handleInputChange}
                className="cliente-select"
              >
                <option value="Gabrielle Gualberto Carvalheiro Bastida">
                  Gabrielle Gualberto Carvalheiro Bastida
                </option>
                <option value="Outro Cliente">Outro Cliente</option>
              </select>
            </div>
          </div>

          {/* Campos do formulário */}
          <div className="form-fields">
            <div className="form-column">
              <div className="form-group">
                <label>Forma de Pagamento</label>
                <select 
                  name="formaPagamento" 
                  value={formData.formaPagamento}
                  onChange={handleInputChange}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Intervalo</label>
                <select 
                  name="intervalo" 
                  value={formData.intervalo}
                  onChange={handleInputChange}
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>

              <div className="form-group">
                <label>Data de vencimento da primeira cobrança</label>
                <input 
                  type="text" 
                  name="dataVencimento" 
                  value={formData.dataVencimento}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Juros ao mês</label>
                <div className="juros-input">
                  <input 
                    type="text" 
                    value="%" 
                    readOnly 
                    className="juros-symbol"
                  />
                  <input 
                    type="number" 
                    name="juros" 
                    value={formData.juros}
                    onChange={handleInputChange}
                    className="juros-value"
                  />
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Valor fixo</label>
                <input 
                  type="text" 
                  name="valorFixo" 
                  value={formData.valorFixo}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="form-group">
                <label>Data de fim da assinatura</label>
                <input 
                  type="text" 
                  name="dataFim" 
                  value={formData.dataFim}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Data de fim da assinatura</label>
                <input 
                  type="text" 
                  name="valorFim" 
                  value={formData.valorFim}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
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
