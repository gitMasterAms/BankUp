import { useState } from 'react';

// Importa componentes da home
import Header from './components/Header';
import Hero from './components/Hero';
import CaloteSection from './components/CaloteSection';
import AprendaSection from './components/AprendaSection';
import Footer from './components/Footer';

// Importa as páginas do app
import Login from './Login.jsx';
import Cadastro from './Cadastro.jsx';
import Token from './Token.jsx';
import Planos from './Planos.jsx';
import CadAdicional from './CadAdicional.jsx';

import './index.css';

function App() {
  // Controla qual "página" será exibida (home, login, cadastro etc.)
  const [paginaAtual, setPaginaAtual] = useState('home');

  return (
    <>
      {paginaAtual === 'home' && (
        <>
          <Header irParaPagina={setPaginaAtual} />
          <Hero />
          <CaloteSection />
          <AprendaSection />
          <Footer />
        </>
      )}

      {paginaAtual === 'login' && <Login irParaPagina={setPaginaAtual} />}
      {paginaAtual === 'cadastro' && <Cadastro irParaPagina={setPaginaAtual} />}
      {paginaAtual === 'token' && <Token irParaPagina={setPaginaAtual} />}
      {paginaAtual === 'planos' && <Planos irParaPagina={setPaginaAtual} />}
      {paginaAtual === 'cadAdicional' && <CadAdicional irParaPagina={setPaginaAtual} />}
    </>
  );
}

export default App;
