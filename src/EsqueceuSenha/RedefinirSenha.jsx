import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import CapsLockWarning, { useCapsLock } from '../components/CapsLockWarning';
import { API_URL } from '../config/api';

function RedefinirSenha() {
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();
  const capsLockOn = useCapsLock();

  const userId = localStorage.getItem('userId');
  const resetToken = localStorage.getItem('resetToken');

  // Proteção: se o usuário chegar aqui sem userId, volta ao início do fluxo
  useEffect(() => {
    if (!userId) {
      alert('Sessão inválida. Por favor, comece o processo novamente.');
      navigate('/esquecer-senha');
    }
  }, [userId, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      setSalvando(true);

      const resposta = await fetch(`${API_URL}/user/password-reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resetToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: senha, }),
      });

      if (resposta.ok) {
        alert('Senha redefinida com sucesso!');
        
        // Limpa todos os dados temporários usados no fluxo
        localStorage.removeItem('resetToken');

        navigate('/login');
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Não foi possível redefinir a senha. O token pode ter expirado.');
      }
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="tela-login">
      <button className="home-button" onClick={() => navigate('/login')}>
        ← Voltar para Login
      </button>
      <div className="login-container">
        <h1>Redefinir senha</h1>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="senha">Nova senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite a nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <CapsLockWarning show={capsLockOn && document.activeElement?.id === 'senha'} className="login-caps-warning" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmar">Confirmar nova senha</label>
            <input
              id="confirmar"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
            <CapsLockWarning show={capsLockOn && document.activeElement?.id === 'confirmar'} className="login-caps-warning" />
          </div>
          <button type="submit" className="login-btn" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RedefinirSenha;