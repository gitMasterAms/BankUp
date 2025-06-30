// Importa o CSS exclusivo da tela de login
import './styles/login.css';

// Componente de tela de login
// Recebe a função irParaPagina como prop (vinda do App.jsx) para mudar a página atual
function Login({ irParaPagina }) {
  // Função que trata o envio do formulário de login (neste caso apenas um alerta)
  const handleSubmit = (e) => {
    e.preventDefault(); // evita o recarregamento da página
    alert('Login enviado!');
  };

  return (
    <div className="tela-login">
      <div className="login-container">
        <h1>Bem-vindo de volta</h1>
        {/* Formulário de login */}
        <form onSubmit={handleSubmit}>
          {/* Campo de e-mail */}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="Digite seu e-mail" required />
          </div>

          {/* Campo de senha */}
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="Digite sua senha" required />

            {/* Link de "Esqueceu a senha?" */}
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>

          {/* Botão de envio */}
          <button type="submit" className="login-btn" onClick={() => irParaPagina('token')}>Entrar</button>
        </form>

        {/* Link para a tela de cadastro usando a função de navegação */}
        <p className="signup-link">
          Não tem conta ainda?{' '}
          <a href="#" onClick={() => irParaPagina('cadastro')}>
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
