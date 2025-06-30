// Importa o React hook useState para controlar o estado dos inputs
import { useState } from 'react';
// Importa o arquivo CSS exclusivo para a tela de cadastro
import './styles/cadastro.css';

// Componente de Cadastro
function Cadastro({ irParaPagina }) {
  // Estado para armazenar o email digitado
  const [email, setEmail] = useState('');
  // Estado para armazenar a senha digitada
  const [senha, setSenha] = useState('');
  // Estado para armazenar a confirmação da senha
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Função chamada ao clicar no botão "Verificar Email"
  const verificarEmail = () => {
    // Validação simples de formato de e-mail
    if (!email.includes('@') || !email.includes('.')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    // Verifica se as senhas digitadas são iguais
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    // Exibe mensagem de sucesso e redireciona para a tela de login
    alert('Cadastro realizado com sucesso!');
    irParaPagina('login');
  };

  return (
    <div className="cadastro-wrapper">
      {/* Formulário principal de cadastro */}
      <form className="cadastro-form">
        <h2 className="cadastro-titulo">Criar Conta</h2>

        {/* Campo de e-mail */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email
          required
        />

        {/* Campo de senha */}
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)} // Atualiza o estado da senha
          required
        />

        {/* Campo de confirmação da senha */}
        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <input
          type="password"
          id="confirmarSenha"
          placeholder="Repita sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)} // Atualiza o estado da confirmação
          required
        />

        {/* Botão para validar email e senhas */}
        <button type="button" onClick={verificarEmail}>
          Verificar Email
        </button>

        {/* Link para a tela de login */}
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

// Exporta o componente para ser usado no App.jsx
export default Cadastro;
