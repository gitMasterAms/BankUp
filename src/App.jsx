// Importa os componentes de roteamento do React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa os componentes da página inicial
import Header from './components/Header';
import Hero from './components/Hero';
import CaloteSection from './components/CaloteSection';
import AprendaSection from './components/AprendaSection';
import Footer from './components/Footer';

// Importa as páginas do aplicativo
import Login from './Login.jsx';
import Cadastro from './Cadastro.jsx';
import Token from './Token.jsx';
import Planos from './Planos.jsx';
import CadAdicional from './CadAdicional.jsx';
import CadastrarCliente from './CadClientes.jsx';


// Importa a Home interna (com sidebar)
import HomeInterna from './HomeInterna.jsx';

// Importa a página de cobrança
import Cobranca from './cobrança/indexCobranca.jsx';

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
      <AprendaSection />
      <Footer />
    </>
  );
}

// Componente principal da aplicação
function App() {
  return (
    // Define o roteador principal da aplicação
    <Router>
      {/* Define todas as rotas da aplicação */}
      <Routes>
        {/* Quando a URL for "/", mostra a Home pública */}
        <Route path="/" element={<Home />} />

        {/* Quando a URL for "/login", mostra o componente Login */}
        <Route path="/login" element={<Login />} />

        {/* Quando a URL for "/cadastro", mostra o componente Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Quando a URL for "/token", mostra o componente Token */}
        <Route path="/token" element={<Token />} />

        {/* Quando a URL for "/planos", mostra o componente Planos */}
        <Route path="/planos" element={<Planos />} />

        {/* Quando a URL for "/cadAdicional", mostra o componente CadAdicional */}
        <Route path="/cadAdicional" element={<CadAdicional />} />

        {/* Quando a URL for "/home", mostra a Home interna com sidebar */}
        <Route path="/home" element={<HomeInterna />} />

        {/* Quando a URL for "/CadClientes", mostra a Home interna com sidebar */}

        <Route path="/cadclientes" element={<CadastrarCliente />} />

        {/* Quando a URL for "/cobranca", mostra a página de cobrança com sidebar */}
        <Route path="/cobranca" element={<Cobranca />} />


      </Routes>
    </Router>
  );
}

// Exporta o componente App para ser usado no index.jsx
export default App;
