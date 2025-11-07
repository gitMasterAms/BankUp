// Importa o hook de navegação do React Router
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCadastroModal } from '../contexts/CadastroModalContext';
import { useLoginModal } from '../contexts/LoginModalContext';

function Header() {
  // Hook para redirecionar entre páginas
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const { openModal: openCadastroModal } = useCadastroModal();
  const { openModal: openLoginModal } = useLoginModal();

  return (
    <header className="cabecalho">
      {/* Botão hamburguer do topo (apenas mobile) */}
      <button
        className="header-hamburger"
        aria-label="Abrir menu do topo"
        aria-expanded={menuAberto}
        onClick={() => setMenuAberto((v) => !v)}
      >
        ☰
      </button>

       <div className="logo">
        <img src="/imagens/logo.png" alt="BankUp" className="logo-img" />
      </div>

      {/* Menu de navegação */}
      <nav className={`menu ${menuAberto ? 'open' : ''}`}>
        {/*<a href="#" className="btn" onClick={(e) => { e.preventDefault(); navigate('/home'); setMenuAberto(false); }}>Home</a>*/}
        <a href="#" className="btn" onClick={(e) => { e.preventDefault(); navigate('/sobre'); setMenuAberto(false); }}>Sobre nós</a> 
        <a href="#serviços" className="btn" onClick={() => setMenuAberto(false)}>Serviços</a>
        <a href="#" className="btn" onClick={(e) => { e.preventDefault(); openLoginModal(); setMenuAberto(false); }}>Entrar</a>
        <a href="#" className="btn btn-secundario" onClick={(e) => { e.preventDefault(); openCadastroModal(); setMenuAberto(false); }}>Cadastre-se Já</a>
      </nav>
    </header>
  );
}

export default Header;
