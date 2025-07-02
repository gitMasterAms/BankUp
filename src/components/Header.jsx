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
        {/* Ainda usa âncora interna para rolar até a seção de serviços */}
        <a href="#serviços" className="btn">Serviços</a>

        {/* Botões de navegação usando navigate() para mudar de rota */}
        <a
          href="#"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            navigate('/planos');
          }}
        >
          Planos
        </a>

        <a
          href="#"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
        >
          Entrar
        </a>

        <a
          href="#"
          className="btn btn-secundario"
          onClick={(e) => {
            e.preventDefault();
            navigate('/cadastro');
          }}
        >
          Cadastrar
        </a>
      </nav>
    </header>
  );
}

export default Header;
