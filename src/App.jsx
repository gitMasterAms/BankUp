// Importa os componentes de roteamento do React Router
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Importa os componentes da página inicial
import Header from './components/Header';
import Hero from './components/Hero';
import CaloteSection from './components/CaloteSection';
import TaxaSection from './components/TaxaSection';
import AprendaSection from './components/AprendaSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Importa as páginas do aplicativo
import Login from './Login.jsx';
import Cadastro from './Cadastro.jsx';
import Token from './Token.jsx';
import EsquecerSenha from './EsqueceuSenha/EsquecerSenha.jsx';
import RedefinirSenha from './EsqueceuSenha/RedefinirSenha.jsx';
import CadAdicional from './CadAdicional.jsx';
import SobreNos from './SobreNos/SobreNos.jsx';
// Página de cadastro de pagador (migrada para a pasta Pagador)
import CadastrarCliente from './Pagador/CadClientes.jsx';

// Importa a Home interna (com sidebar)
import HomeInterna from './HomeInterna.jsx';

// Importa a página de cobrança (form/tela)
import Cobranca from './cobrança/indexCobranca.jsx';

// Importa a página de perfil
import Perfil from './Perfil/perfil.jsx';

// Tabelas (novas rotas)
// - Tabela de pagadores
import PagadorTabela from './Pagador/PagadorTabela.jsx';
// - Tabela de cobranças
import CobrancaTabela from './cobrança/cobrancaTabela.jsx';

// Importa o contexto do modal de cadastro
import { CadastroModalProvider, useCadastroModal } from './contexts/CadastroModalContext';
// Importa o contexto do modal de login
import { LoginModalProvider, useLoginModal } from './contexts/LoginModalContext';

// Importa os estilos globais
import './index.css';


// Componente que representa a página inicial ("/")
function Home() {
  return (
    <>
      {/* Componentes da home exibidos na ordem */}
      <Header />
      <Hero />
      <CaloteSection />
      <TaxaSection />
      <AprendaSection />
      <Footer />
      
      {/* Botão de voltar ao topo */}
      <ScrollToTop />
    </>
  );
}

// Componente auxiliar para abrir o modal quando acessar a rota /cadastro
function CadastroRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useCadastroModal();

  useEffect(() => {
    // Se acessar diretamente a rota /cadastro, abre o modal e redireciona para home
    if (location.pathname === '/cadastro') {
      openModal();
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate, openModal]);

  return null;
}

// Componente auxiliar para abrir o modal quando acessar a rota /login
function LoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useLoginModal();

  useEffect(() => {
    // Se acessar diretamente a rota /login, abre o modal e redireciona para home
    if (location.pathname === '/login') {
      openModal();
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate, openModal]);

  return null;
}

// Componente principal da aplicação
function AppContent() {
  return (
    <>
      {/* Modais (renderizados globalmente) */}
      <Cadastro />
      <Login />
      
      {/* Define todas as rotas da aplicação */}
      <Routes>
        {/* Quando a URL for "/", mostra a Home pública */}
        <Route path="/" element={<Home />} />

        {/* Rota /login redireciona para home e abre o modal */}
        <Route path="/login" element={<LoginRedirect />} />

        {/* Rota /cadastro redireciona para home e abre o modal */}
        <Route path="/cadastro" element={<CadastroRedirect />} />

        {/* Quando a URL for "/token", mostra o componente Token */}
        <Route path="/token" element={<Token />} />

        {/* Recuperação de Senha */}
        {/* 1) Tela para informar e-mail e enviar código */}
        <Route path="/esquecer-senha" element={<EsquecerSenha />} />
        {/* 2) Tela para digitar o código recebido por e-mail */}
        <Route path="/verificar-email" element={<Token />} />
        {/* 3) Tela para cadastrar nova senha após verificar código */}
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />


        {/* Quando a URL for "/sobre", mostra a página Sobre Nós */}
        <Route path="/sobre" element={<SobreNos />} />

        {/* Quando a URL for "/cadAdicional", mostra o componente CadAdicional */}
        <Route path="/cadAdicional" element={<CadAdicional />} />

        {/* Quando a URL for "/home", mostra a Home interna com sidebar */}
        <Route path="/home" element={<HomeInterna />} />

        {/* Cadastro de pagador (agora em /Pagador/CadClientes.jsx) */}
        <Route path="/cadclientes" element={<CadastrarCliente />} />

        {/* Tela de cobrança (formulário principal) */}
        <Route path="/cobranca" element={<Cobranca />} />

        {/* Tabela de pagadores (lista) */}
        <Route path="/tabela/pagadores" element={<PagadorTabela />} />

        {/* Tabela de cobranças (lista) */}
        <Route path="/tabela/cobrancas" element={<CobrancaTabela />} />

        {/* Página de perfil do usuário - exibe informações do cadastro e cadadicional */}
        <Route path="/perfil" element={<Perfil />} />


      </Routes>
    </>
  );
}

// Componente principal da aplicação com Providers
function App() {
  return (
    // Define o roteador principal da aplicação
    <Router>
      <CadastroModalProvider>
        <LoginModalProvider>
          <AppContent />
        </LoginModalProvider>
      </CadastroModalProvider>
    </Router>
  );
}

// Exporta o componente App para ser usado no index.jsx
export default App;
