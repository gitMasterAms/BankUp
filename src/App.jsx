import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



import Header from './components/Header';
import Hero from './components/Hero';
import CaloteSection from './components/CaloteSection';
import AprendaSection from './components/AprendaSection';
import Footer from './components/Footer';

import Login from './Login.jsx';
import Cadastro from './Cadastro.jsx';
import Token from './Token.jsx';
import Planos from './Planos.jsx';
import CadAdicional from './CadAdicional.jsx';


import './index.css';

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <CaloteSection />
      <AprendaSection />
      <Footer />
    </>
  );
}

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/token" element={<Token />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/cadAdicional" element={<CadAdicional />} />
      </Routes>
    </Router>
  );
}

export default App;
