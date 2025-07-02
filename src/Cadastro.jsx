import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/cadastro.css';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const navigate = useNavigate();

  // Verifica se o usuário já tem um token válido salvo
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://100.108.7.70:3000/user/check', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid === true) {
            // Token válido, redireciona para /planos
            navigate('/planos');
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
      const resposta = await fetch('http://100.108.7.70:3000/user/register', {
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
        navigate('/login');
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Erro ao cadastrar. Verifique os dados.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
  };

  return (
    <div className="cadastro-wrapper">
      <form className="cadastro-form">
        <h2 className="cadastro-titulo">Criar Conta</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <input
          type="password"
          id="confirmarSenha"
          placeholder="Repita sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        <button type="button" onClick={verificarEmail}>
          Verificar Email
        </button>

        <p className="login-link">
          Já tem uma conta?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
