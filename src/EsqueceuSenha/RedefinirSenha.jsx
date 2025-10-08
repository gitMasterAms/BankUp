import { useState } from 'react';
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

  const email = localStorage.getItem('reset_email');
  const resetToken = localStorage.getItem('reset_token');

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
    if (!email) {
      alert('E-mail não identificado. Volte e informe seu e-mail.');
      navigate('/esquecer-senha');
      return;
    }

    try {
      setSalvando(true);
      // Envia a nova senha; alguns backends esperam um token temporário
      const resposta = await fetch(`${API_URL}/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha, token: resetToken }),
      });

      if (resposta.ok) {
        alert('Senha redefinida com sucesso!');
        // Limpa artefatos do fluxo
        localStorage.removeItem('reset_email');
        localStorage.removeItem('reset_token');
        navigate('/login');
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Não foi possível redefinir a senha.');
      }
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="tela-login">{/* Reuso do layout/cores do login/cadastro */}
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


