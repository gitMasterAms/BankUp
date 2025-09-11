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

      {/* Menu de navegação principal */}
      <ul>
        <li>
          <button 
            className={`sidebar-button ${isActive('/home') ? 'active' : ''}`}
            onClick={() => navigate('/home')}
          >
            <span className="icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3.172l8 7V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.828l8-7zM12 1l-10 8.75V20a4 4 0 0 0 4 4h5v-6h2v6h5a4 4 0 0 0 4-4V9.75L12 1z"/>
              </svg>
            </span>
            Home
          </button>
        </li>
        
        <li>
          <button 
            className={`sidebar-button ${isActive('/notificacoes') ? 'active' : ''}`}
            onClick={() => navigate('/notificacoes')}
          >
            <span className="icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 24zm6.36-6V11a6.36 6.36 0 0 0-12.72 0v7L3 19v1h18v-1l-2.64-1zM18 18H6v-7a6 6 0 1 1 12 0v7z"/>
              </svg>
            </span>
            Notificações
          </button>
        </li>
        
        <li>
          <button 
            className={`sidebar-button ${isActive('/planos') ? 'active' : ''}`}
            onClick={() => navigate('/planos')}
          >
            <span className="icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm.5 17.5h-1v-1.078c-1.51-.172-2.75-1.06-3-2.422h1.75c.21.63.9 1.094 1.86 1.094 1.05 0 1.74-.516 1.74-1.234 0-.633-.442-.992-1.64-1.25l-1.12-.25c-1.79-.398-2.69-1.218-2.69-2.57 0-1.485 1.16-2.598 2.86-2.87V5.5h1v1.062c1.61.172 2.71 1.078 2.93 2.328h-1.73c-.2-.594-.82-1.016-1.69-1.016-.96 0-1.62.47-1.62 1.156 0 .57.41.91 1.51 1.156l1.19.28c1.99.46 2.75 1.18 2.75 2.56 0 1.594-1.2 2.73-2.97 2.98v1.5z"/>
              </svg>
            </span>
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
            <span className="icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7H3a1 1 0 0 0-1 1v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zm-1 2v6H4V9h16zm-9 3.5a2.5 2.5 0 1 0 0-5h-1v-1H9v1H7v2h2v2H7v2h2v1h1v-1h1a2.5 2.5 0 0 0 0-5h-1v2h1z"/>
              </svg>
            </span>
            Cobranças
          </button>
        </li>

         <li>
          <button 
            className={`sidebar-button ${isActiveRelated('/cadclientes') || isActive('/tabela/pagadores') ? 'active' : ''}`}
            onClick={() => navigate('/tabela/pagadores')}
          >
            <span className="icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a5 5 0 1 0-6 0C6.33 12 2 13.34 2 16v2h12v-2c0-2.66-4.33-4-7-4a5 5 0 1 0 8 0h2v-2h-2v2zM20 10V7h-2V5h2V3h2v2h2v2h-2v3h-2z"/>
              </svg>
            </span>
            Clientes
          </button>
        </li>
        
        <li>
          <button 
            className={`sidebar-button ${isActive('/graficos') ? 'active' : ''}`}
            onClick={() => navigate('/graficos')}
          >
            <span className="icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2v18H3V3zm16 7h2v11h-2V10zM9 13h2v8H9v-8zm6-10h2v18h-2V3z"/>
              </svg>
            </span>
            Gráficos
          </button>
        </li>
       
        
      </ul>

      {/* Botão de logout no final da sidebar */}
      <div className="logout-container">
        <Logout />
      </div>

    </div>
  );
}

export default Sidebar;
