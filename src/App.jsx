import Header from './components/Header';
import Hero from './components/Hero';
import CaloteSection from './components/CaloteSection';
import AprendaSection from './components/AprendaSection';
import Footer from './components/Footer';
import './index.css';  // Importando seu CSS antigo

function App() {
  return (
    <>
      {/* Cabeçalho */}
      <Header />

      {/* Seção principal */}
      <Hero />

      {/* Chega de Calote */}
      <CaloteSection />

      {/* Aprenda com profissionais */}
      <AprendaSection />

      {/* Rodapé */}
      <Footer />
    </>
  );
}

export default App;
