import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';
import CapsLockWarning, { useCapsLock } from './components/CapsLockWarning';
import { API_URL } from './config/api';
import { useCadastroModal } from './contexts/CadastroModalContext';
import { useLoginModal } from './contexts/LoginModalContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const { openModal: openCadastroModal } = useCadastroModal();
  const { isOpen, closeModal } = useLoginModal();
  
  // Hook para detectar se o Caps Lock está ativado
  const capsLockOn = useCapsLock();

  // Verifica token já salvo apenas quando o modal está aberto
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && isOpen) {
      fetch(`${API_URL}/user/check`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid === true) {
            // Token válido, fecha o modal e redireciona para /home
            closeModal();
            navigate('/home');
          }
        })
        .catch(err => {
          console.log('Erro ao verificar o token ou conexão:', err);
        });
    }
  }, [navigate, isOpen, closeModal]);

  // Limpa os campos quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSenha('');
    }
  }, [isOpen]);

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Login
      const loginRes = await fetch(`${API_URL}/user/login`, {
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
      const type = 'login_verification';
      // 2. Enviar código com userId, email e type
      const sendCodeRes = await fetch(`${API_URL}/user/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          type,
        }),
      });

      if (sendCodeRes.ok) {
        alert('Código de verificação enviado.');
        localStorage.setItem('type', type);
        closeModal();
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

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={closeModal}>
      <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="login-modal-close"
          onClick={closeModal}
          aria-label="Fechar modal"
        >
          ×
        </button>
        
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
              <a href="#" className="forgot-password" onClick={(e) => { 
                e.preventDefault(); 
                closeModal();
                navigate('/esquecer-senha'); 
              }}>Esqueceu a senha?</a>
            </div>

            <button type="submit" className="login-btn">Entrar</button>
          </form>

          <p className="signup-link">
            Não tem conta ainda?{' '}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              closeModal();
              openCadastroModal();
            }}>
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
