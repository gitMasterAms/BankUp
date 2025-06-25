import { useState } from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import CaloteSection from './components/CaloteSection';
import AprendaSection from './components/AprendaSection';
import Footer from './components/Footer';

import Login from './Login.jsx';
import Cadastro from './Cadastro.jsx';

import './index.css';

function App() {
  const [paginaAtual, setPaginaAtual] = useState('home');

  return (
    <>
      {/* Rotas controladas por estado */}
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
    </>
  );
}

export default App;
