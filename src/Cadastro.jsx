import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Cadastro.css';
import CapsLockWarning, { useCapsLock } from './components/CapsLockWarning';
import { API_URL } from './config/api';
import { useCadastroModal } from './contexts/CadastroModalContext';
import { useLoginModal } from './contexts/LoginModalContext';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const navigate = useNavigate();
  const { isOpen, closeModal } = useCadastroModal();
  const { openModal: openLoginModal } = useLoginModal();

  // Hook para detectar se o Caps Lock está ativado
  const capsLockOn = useCapsLock();

  // Verifica se o usuário já tem um token válido salvo
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
            closeModal();
            navigate('/home');
          }
        })
        .catch(err => {
          console.log('Erro ao verificar o token:', err);
        });
    }
  }, [navigate, isOpen, closeModal]);

  // Limpa os campos quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
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

  const verificarEmail = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: senha,
          confirmpassword: confirmarSenha,
        }),
      });

      if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        closeModal();
        openLoginModal();
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Erro ao cadastrar. Verifique os dados.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cadastro-modal-overlay" onClick={closeModal}>
      <div className="cadastro-modal-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="cadastro-modal-close"
          onClick={closeModal}
          aria-label="Fechar modal"
        >
          ×
        </button>

        <div className="login-container">
          <h1>Criar conta</h1>
          <form onSubmit={(e) => { e.preventDefault(); verificarEmail(); }}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <CapsLockWarning 
                show={capsLockOn && document.activeElement?.id === 'senha'} 
                className="login-caps-warning"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Repita sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              <CapsLockWarning 
                show={capsLockOn && document.activeElement?.id === 'confirmarSenha'} 
                className="login-caps-warning"
              />
            </div>

            <button type="submit" className="login-btn">Criar conta</button>
          </form>

          <p className="signup-link">
            Já tem uma conta?{' '}
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              closeModal();
              openLoginModal();
            }}>
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;