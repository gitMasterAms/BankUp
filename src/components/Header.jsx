// Importa o hook de navegação do React Router
import { useNavigate } from 'react-router-dom';

function Header() {
  // Hook para redirecionar entre páginas
  const navigate = useNavigate();

  return (
    <header className="cabecalho">
      {/* Logo do site */}
      <div className="logo">Bank<span>Up</span></div>

      {/* Menu de navegação */}
      <nav className="menu">
      <a href="#" className="btn" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a> 

        <a href="#serviços" className="btn">Serviços</a>
        <a href="#" className="btn" onClick={(e) => { e.preventDefault(); navigate('/planos'); }}>Planos</a>
        <a href="#" className="btn" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Entrar</a>
        <a href="#" className="btn btn-secundario" onClick={(e) => { e.preventDefault(); navigate('/cadastro'); }}>Cadastrar</a>
      </nav>
    </header>
  );
}

export default Header;
