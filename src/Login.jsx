import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Verifica token já salvo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const emailSalvo = localStorage.getItem('email');

    if (token && emailSalvo) {
      fetch(`http://100.108.7.70:3000/user/check?email=${emailSalvo}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid === true) {
          
            navigate('/perfil');
          }
        })
        .catch((err) => console.log('Token inválido:', err));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Login
      const loginRes = await fetch('http://100.108.7.70:3000/user/login', {
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
      const sendCodeRes = await fetch('http://100.108.7.70:3000/user/send-code', {
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
