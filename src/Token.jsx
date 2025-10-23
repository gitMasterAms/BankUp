import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/token.css';
import { API_URL } from './config/api';

function Token() {
  const [codigo, setCodigo] = useState('');
  const [verificando, setVerificando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerificando(true);

    const userId = localStorage.getItem('userId');
    const type = localStorage.getItem('type');

    if (!userId || !type) {
      alert('Sessão de verificação inválida. Por favor, tente novamente.');
      navigate('/login');
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/user/verify-code`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, twoFactorCode: codigo }),
      });

      const data = await resposta.json();

      if (resposta.ok) {
        alert('Código verificado com sucesso!');

        if (type === 'password_reset') {
          
          if(data.resetToken) {
            localStorage.setItem('resetToken', data.resetToken);
          }
          localStorage.removeItem('type')
          navigate('/redefinir-senha');

        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('profile_complete', data.profile_complete);
          localStorage.removeItem('userId');
          localStorage.removeItem('type');
          
          navigate(data.profile_complete ? '/home' : '/cadAdicional');
        }
      } else {
        alert(data.msg || 'Código inválido ou expirado.');
      }
    } catch (err) {
      console.error('Erro ao verificar código:', err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setVerificando(false);
    }
  };

  const reenviarCodigo = async () => {
    const userId = localStorage.getItem('userId');
    const type = localStorage.getItem('type');

    if (!userId || !type) {
      alert('Não foi possível identificar a sessão para reenviar o código.');
      return;
    }

    try {
      await fetch(`${API_URL}/user/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type }),
      });
      alert('Um novo código foi enviado para seu e-mail.');
    } catch (err) {
      alert('Erro ao reenviar código.');
    }
  };

  return (
    <div className="tela-token">
      <div className="token-container">
        <h2 className="token-titulo">Verificação de Segurança</h2>
        <p className="token-subtexto">Enviamos um código para seu e-mail. Digite-o abaixo para continuar.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="codigo">Código de Verificação</label>
          <input
            type="text"
            id="codigo"
            placeholder="Digite o código recebido"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit" className="btn-verificar" disabled={verificando}>
            {verificando ? 'Verificando...' : 'Verificar'}
          </button>
        </form>
        <button onClick={reenviarCodigo} className="btn-reenviar">
          Reenviar código
        </button>
      </div>
    </div>
  );
}

export default Token;