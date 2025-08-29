import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Planos.css'; // Importando o CSS exclusivo da página de planos
import Logout from './components/Logout';

function Planos() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const profileComplete = localStorage.getItem('profile_complete');

    // Se não tiver token, redireciona para /login
    if (!token) {
      navigate('/login');
      return;
    }

    // Se o perfil não estiver completo, redireciona para /cadAdicional
    if (profileComplete === 'false') {
      navigate('/cadAdicional');
      return;
    }

    // Se tudo estiver certo, o usuário permanece na página de planos
  }, [navigate]);

  return (
    <div className="precos-wrapper">
      <Logout />
      {/* Título principal da página */}
      <h1 className="precos-titulo">Escolha o melhor preço</h1>

      {/* Container com os 3 cards de planos */}
      <div className="precos-cards">
        {/* Plano Grátis */}
        <div className="precos-card">
          <h2 className="precos-nome precos-gratis">Grátis</h2>
          <p className="precos-preco">R$0,00</p>
          <p className="precos-sub">6 MESES DE TESTE</p>
          <ul className="precos-lista">
            <li>GERENCIE TODOS OS SEUS CLIENTES <span className="precos-check">✓</span></li>
            <li>CRIE TAGS ILIMITADAS PARA ORGANIZAR <span className="precos-check">✓</span></li>
            <li>VEJA QUEM ESTÁ NO NEGATIVO <span className="precos-check">✓</span></li>
            <li>MANDE MENSAGENS PERSONALIZADAS <span className="precos-check">✓</span></li>
          </ul>
        </div>

        {/* Plano Básico */}
        <div className="precos-card">
          <h2 className="precos-nome precos-basico">Básico</h2>
          <p className="precos-preco">R$0,10</p>
          <p className="precos-sub">PARA PEQUENAS EMPRESAS</p>
          <ul className="precos-lista">
            <li>GERENCIE ATÉ 1.500 CLIENTES <span className="precos-check">✓</span></li>
            <li>CRIE ATÉ 5 TAGS <span className="precos-check">✓</span></li>
            <li>VEJA ATÉ 15 CLIENTES QUE ESTÃO NO NEGATIVO <span className="precos-check">✓</span></li>
            <li>MANDE MENSAGENS PERSONALIZADAS <span className="precos-x">✘</span></li>
          </ul>
        </div>

        {/* Plano Premium */}
        <div className="precos-card">
          <h2 className="precos-nome precos-premium">Premium</h2>
          <p className="precos-preco">R$1,00</p>
          <p className="precos-sub">PARA GRANDES EMPRESAS</p>
          <ul className="precos-lista">
            <li>GERENCIE TODOS OS SEUS CLIENTES <span className="precos-check">✓</span></li>
            <li>CRIE TAGS ILIMITADAS PARA ORGANIZAR <span className="precos-check">✓</span></li>
            <li>VEJA QUEM ESTÁ NO NEGATIVO <span className="precos-check">✓</span></li>
            <li>MANDE MENSAGENS PERSONALIZADAS <span className="precos-check">✓</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Planos;
