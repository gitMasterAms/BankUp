import './styles/login.css'; // Importando o CSS específico da tela de login

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode futuramente fazer login de verdade ou redirecionar
    alert('Login enviado!');
  };

  return (
    <div className="tela-login">
      <div className="login-container">
        <h1>Bem-vindo de volta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="Digite seu e-mail" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="Digite sua senha" required />
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>
          <button type="submit" className="login-btn">Entrar</button>
        </form>
        <div className="signup-link">
          Não tem conta ainda? <a href="cadastro.html">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
