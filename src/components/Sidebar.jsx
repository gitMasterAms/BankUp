// Sidebar.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import Logout from './Logout';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Função para verificar se um botão está ativo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Função para verificar se está em uma rota relacionada (para páginas de cadastro)
  const isActiveRelated = (basePath) => {
    return location.pathname.startsWith(basePath);
  };

  return (
    <div className="sidebar">
      {/* Logo da aplicação */}
      <div className="logo">
        Bank<span>Up</span>
      </div>

      <div className="menu-items"> {/* Adicionado: Envolve os botões em uma div */}
        {/* Menu de navegação principal */}
        <ul>
          <li>
            <button 
              className={`sidebar-button ${isActive('/home') ? 'active' : ''}`}
              onClick={() => navigate('/home')}
            >
              {/* ... SVG e texto ... */}
              Home
            </button>
          </li>
          
          <li>
            <button 
              className={`sidebar-button ${isActive('/notificacoes') ? 'active' : ''}`}
              /* onClick={() => navigate('/notificacoes') }*/
            >
              {/* ... SVG e texto ... */}
              Notificações
            </button>
          </li>
          
          <li>
            <button 
              className={`sidebar-button ${isActive('/planos') ? 'active' : ''}`}
              /* onClick={() => navigate('/planos')} */
            >
              {/* ... SVG e texto ... */}
              Seu plano
            </button>
          </li>
        </ul>

        {/* Cabeçalho de seção */}
        <div className="section-title">Funções</div>

        {/* Menu de funções */}
        <ul>
          <li>
            <button 
              className={`sidebar-button ${isActiveRelated('/cobranca') || isActive('/tabela/cobrancas') ? 'active' : ''}`}
              onClick={() => navigate('/tabela/cobrancas')}
            >
              {/* ... SVG e texto ... */}
              Cobranças
            </button>
          </li>

          <li>
            <button 
              className={`sidebar-button ${isActiveRelated('/cadclientes') || isActive('/tabela/pagadores') ? 'active' : ''}`}
              onClick={() => navigate('/tabela/pagadores')}
            >
              {/* ... SVG e texto ... */}
              Clientes
            </button>
          </li>
          
          <li>
            <button 
              className={`sidebar-button ${isActive('/graficos') ? 'active' : ''}`}
              /* onClick={() => navigate('/graficos')} ... */
            >
              {/* ... SVG e texto ... */}
              Gráficos
            </button>
          </li>
          
        </ul>
      </div>
      <div className="logout-item">
        <Logout />
      </div>

    </div>
  );
}

export default Sidebar;