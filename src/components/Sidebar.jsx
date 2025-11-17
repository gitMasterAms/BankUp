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
        <img src="/imagens/logo.png" alt="BankUp" className="logo-image" />
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

        {/* Cabeçalho de seção para perfil */}
        <div className="section-title">Conta</div>

        {/* Menu de perfil - acesso às informações do usuário */}
        <ul>
          <li>
            <button 
              className={`sidebar-button ${isActive('/perfil') ? 'active' : ''}`}
              onClick={() => navigate('/perfil')}
            >
              <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Perfil
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