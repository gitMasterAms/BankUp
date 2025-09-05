import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';
import CapsLockWarning, { useCapsLock } from './components/CapsLockWarning';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  
  // Hook para detectar se o Caps Lock está ativado
  const capsLockOn = useCapsLock();

  // Verifica token já salvo
 useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('/api/user/check', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid === true) {
            // Token válido, redireciona para /home
            navigate('/home');
          } else {
            // Token inválido, redireciona para /login
            navigate('/login');
          }
        })
        .catch(err => {
          console.log('Erro ao verificar o token ou conexão:', err);
          navigate('/login'); // Caso haja erro, redireciona para login
        });
    } else {
      // Se não houver token, redireciona para /login
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Login
      const loginRes = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!loginRes.ok) {
        const erro = await loginRes.json();
        alert(erro.msg || 'Login inválido.');
        return;
      }

      const loginData = await loginRes.json();
      const userId = loginData.id;

      // Salva email e userId localmente
      localStorage.setItem('email', email);
      localStorage.setItem('userId', userId);

      // 2. Enviar código com userId, email e type
      const sendCodeRes = await fetch('/api/user/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          type: 'login_verification',
        }),
      });

      if (sendCodeRes.ok) {
        alert('Código de verificação enviado.');
        navigate('/token');
      } else {
        const erro = await sendCodeRes.json();
        alert(erro.msg || 'Erro ao enviar o código.');
      }

    } catch (err) {
      console.error('Erro geral no login:', err);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="tela-login">
      <div className="login-container">
        <h1>Bem-vindo de volta</h1>
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {/* Aviso de Caps Lock - só aparece quando o campo de senha tem foco e Caps Lock está ativado */}
            <CapsLockWarning 
              show={capsLockOn && document.activeElement?.id === 'password'} 
              className="login-caps-warning"
            />
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>

        <p className="signup-link">
          Não tem conta ainda?{' '}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate('/cadastro');
          }}>
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
