import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

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
            className="sidebar-button" 
            onClick={() => navigate('/home')}
          >
            🏠 Casa
          </button>
        </li>
        
        <li>
          <button 
            className="sidebar-button" 
            onClick={() => navigate('/notificacoes')}
          >
            🔔 Notificações
          </button>
        </li>
        
        <li>
          <button 
            className="sidebar-button" 
            onClick={() => navigate('/planos')}
          >
            $ Seu plano
          </button>
        </li>
      </ul>

      {/* Cabeçalho de seção */}
      <div className="section-title">Funções</div>

      {/* Menu de funções */}
      <ul>
        <li>
          <button 
            className="sidebar-button" 
            onClick={() => navigate('/cobranca')}
          >
            💰 Criar cobrança
          </button>
        </li>
        
        <li>
          <button 
            className="sidebar-button" 
            onClick={() => navigate('/graficos')}
          >
            📊 Gráficos
          </button>
        </li>
        
        <li>
          <button 
            className="sidebar-button" 
            onClick={() => navigate('/cadclientes')}
          >
            👤➕ Cadastrar clientes
          </button>
        </li>
      </ul>

      {/* Elementos inferiores */}
      <div className="sidebar-footer">
        <div className="user-avatar">
          <div className="avatar-placeholder">👨‍💼</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
