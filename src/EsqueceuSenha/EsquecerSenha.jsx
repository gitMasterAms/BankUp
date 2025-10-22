import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { API_URL } from '../config/api';

function EsquecerSenha() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  // Modo simulado para navegar sem backend. Quando true, não faz requisições reais.
  const MOCK = true;

  const handleEnviar = async (e) => {
    e.preventDefault();

    if (!email.includes('@') || !email.includes('.')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setEnviando(true);

      if (MOCK) {
        // Simulação: gera um código fixo (ou aleatório) e salva localmente
        const mockCode = '123456';
        localStorage.setItem('reset_email', email);
        localStorage.setItem('reset_code', mockCode);

        // Pequeno atraso para simular rede
        setTimeout(() => {
          alert(`Código enviado (simulado). Use: ${mockCode}`);
          navigate('/verificar-email');
          setEnviando(false);
        }, 600);
        return;
      }

      // Fluxo real (quando tiver backend): envia email para obter código
      const resposta = await fetch(`${API_URL}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (resposta.ok) {
        localStorage.setItem('reset_email', email);
        alert('Enviamos um código de verificação para seu e-mail.');
        navigate('/verificar-email');
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Não foi possível enviar o e-mail.');
      }
    } catch (err) {
      console.error('Erro ao solicitar recuperação:', err);
      alert('Erro de conexão com o servidor.');
    } finally {
      if (!MOCK) setEnviando(false);
    }
  };

  return (
    <div className="tela-login">{/* Reuso do layout/cores do login/cadastro */}
      <button className="home-button" onClick={() => navigate('/login')}>
        ← Voltar para Login
      </button>

      <div className="login-container">
        <h1>Recuperar senha</h1>
        <p style={{ marginTop: 8, marginBottom: 20 }}>Informe o e-mail cadastrado para enviarmos um código.</p>

        <form onSubmit={handleEnviar}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Verificar e-mail'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EsquecerSenha;


