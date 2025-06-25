import { useState } from 'react';
import './styles/Cadastro.css'; // Importa o CSS desta tela

function Cadastro({ irParaPagina }) {
  const [email, setEmail] = useState('');

  // Função que simula a verificação do e-mail
  const verificarEmail = () => {
    if (email.includes('@') && email.includes('.')) {
      alert('E-mail verificado com sucesso!');
    } else {
      alert('Por favor, insira um e-mail válido.');
    }
  };

  return (
    <div className="cadastro-wrapper">
      <form className="cadastro-form" onSubmit={(e) => e.preventDefault()}>
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
          required
        />

        <button type="button" onClick={verificarEmail}>
          Verificar Email
        </button>

        <p className="login-link">
          Já tem uma conta?{' '}
          <a href="#" onClick={() => irParaPagina('login')}>
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
