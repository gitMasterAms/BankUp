// app.js

import React, { useState } from 'react';
import './style.css';

function Home() {
  return (
    <div>
      <header className="cabecalho">
        <div className="logo">Bank<span>Up</span></div>
        <nav className="menu">
          <a href="#serviços" className="btn">Serviços</a>
          <a href="#" className="btn">Planos</a>
          <a href="#" className="btn" onClick={() => window.setPage('login')}>Entrar</a>
          <a href="#" className="btn btn-secundario">Cadastrar</a>
        </nav>
      </header>
      <section className="hero">
        <div className="texto-hero">
          <h1>Automatize sua cobrança. Receba sem pedir, lembre sem insistir.</h1>
          <p>Mais tempo, menos estresse: automatize suas cobranças com um clique.</p>
        </div>
        <img src="imagens/grafico.png" alt="Gráfico ilustrativo" className="img-hero" />
      </section>
      <section className="chega-de-calote">
        <h2>Chega de calote</h2>
        <p>
          Com o BankUp integrado ao WhatsApp, você pode automatizar o pagamento de contas, simplificar o gerenciamento financeiro e oferecer aos jovens usuários um início inteligente e responsável no setor bancário.
        </p>
        <br />
        <br />
        <div className="imagens-calote">
          <div className="fundoOval">
            <img className="mao" src="imagens/dinheiroMao.png" alt="Dinheiro na mão" />
          </div>
          <div className="fundoOval">
            <img className="pessoa" src="imagens/pessoaFeliz.png" alt="Pessoa feliz" />
          </div>
          <div className="fundoOval">
            <img className="chave" src="imagens/chave.png" alt="Chave sendo entregue" />
          </div>
        </div>
        <br />
        <br />
        <p>
          A cobrança que não desgasta sua relação com o cliente vem daqui, pare de correr atrás de pagamentos, seu serviço tem valor. Nossa ferramenta faz seus clientes entenderem isso.
        </p>
      </section>
      <section className="aprenda" id="serviços">
        <h2>Aprenda com profissionais</h2>
        <div className="grid-cards">
          <div className="card">
            <img src="imagens/gerenciarDinheiro.png" alt="Gerenciar dinheiro" />
            <p>Aprenda de forma simples a gerenciar seu dinheiro obtido através do nosso sistema</p>
          </div>
          <div className="card">
            <img src="imagens/grafico-histograma.png" alt="Gráficos" />
            <p>Aprenda com gráficos se sua receita está crescendo</p>
          </div>
          <div className="card">
            <img src="imagens/suporte.png" alt="Suporte" />
            <p>Tenha acesso a uma equipe de suporte para tirar suas dúvidas</p>
          </div>
          <div className="card">
            <img src="imagens/calendario.png" alt="Calendário" />
            <p>Gerencie seu tempo de forma fácil, com acesso a um calendário</p>
          </div>
          <div className="card">
            <img src="imagens/aviso.png" alt="Avisos" />
            <p>Receba avisos de datas, eventos e muito mais!</p>
          </div>
          <div className="card">
            <img src="imagens/tag.png" alt="Tags" />
            <p>Divida facilmente seus serviços através de tags</p>
          </div>
        </div>
      </section>
      <footer className="rodape">
        <p>© 2025 BankUp. Todos os direitos reservados.</p>
        <p>Av. Edouard Six, 540 <br />Jardim Paraiba,<br />Jacareí - São Paulo</p>
        <div className="redes-sociais">
          <a href="#"><img src="imagens/instagram.png" alt="Instagram" style={{width: '20px', verticalAlign: 'middle'}} /> Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

function Login() {
  return (
    <div className="tela-login">
      <div className="login-container">
        <h1>Bem-vindo de volta</h1>
        <form onSubmit={e => { e.preventDefault(); window.setPage('home'); }}>
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
          Não tem conta ainda? <a href="#">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  window.setPage = setPage;
  return page === 'home' ? <Home /> : <Login />;
}

export default App;
