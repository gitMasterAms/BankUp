import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaChartBar, FaHistory, FaUserPlus, FaFileAlt } from "react-icons/fa";
import "../styles/Sidebar.css"; // CSS separado para estilização da sidebar
import Logout from "./Logout";

/**
 * Componente Sidebar - Menu lateral de navegação
 * 
 * Este componente renderiza o menu lateral com as opções de navegação da aplicação.
 * Inclui tanto links para páginas existentes quanto botões para funcionalidades em desenvolvimento.
 * 
 * Funcionalidades:
 * - Navegação para páginas existentes (Casa, Cadastrar clientes)
 * - Botões para funcionalidades futuras (Notificações, Gráficos, Cobranças)
 * - Redirecionamento para página de planos
 * - Componente de logout integrado
 */
export default function Sidebar() {
  const navigate = useNavigate(); // Hook do React Router para navegação programática

  /**
   * Função para lidar com cliques em opções que ainda não têm página implementada
   * @param {string} option - Nome da opção clicada
   */
  const handleOptionClick = (option) => {
    switch(option) {
      case 'notificacoes':
        alert('Funcionalidade de Notificações em desenvolvimento');
        break;
      case 'plano':
        navigate('/planos'); // Redireciona para página de planos existente
        break;
      case 'graficos':
        alert('Funcionalidade de Gráficos em desenvolvimento');
        break;
      case 'cobrancas':
        alert('Funcionalidade de Cobranças em desenvolvimento');
        break;
      default:
        break;
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo da aplicação */}
      <div className="logo">
        BankUp
      </div>
      
      {/* Menu de navegação */}
      <nav>
        <ul>
          {/* Link para página inicial (Home interna) */}
          <li>
            <Link to="/home" className="sidebar-link">
              <FaHome /> Casa
            </Link>
          </li>
          
          {/* Botão para notificações (funcionalidade futura) */}
          <li>
            <button 
              className="sidebar-button" 
              onClick={() => handleOptionClick('notificacoes')}
            >
              <FaBell /> Notificações
            </button>
          </li>
          
          {/* Botão para página de planos (funcionalidade existente) */}
          <li>
            <button 
              className="sidebar-button" 
              onClick={() => handleOptionClick('plano')}
            >
              <FaFileAlt /> Seu plano
            </button>
          </li>
          
          {/* Separador visual para seção de estatísticas */}
          <span className="section-title">Estatísticas</span>
          
          {/* Botão para gráficos (funcionalidade futura) */}
          <li>
            <button 
              className="sidebar-button" 
              onClick={() => handleOptionClick('graficos')}
            >
              <FaChartBar /> Gráficos
            </button>
          </li>
          
          {/* Botão para cobranças (funcionalidade futura) */}
          <li>
            <button 
              className="sidebar-button" 
              onClick={() => handleOptionClick('cobrancas')}
            >
              <FaHistory /> Cobranças
            </button>
          </li>
          
          {/* Link para cadastro de clientes (funcionalidade existente) */}
          <li>
            <Link to="/cadclientes" className="sidebar-link">
              <FaUserPlus /> Cadastrar clientes
            </Link>
          </li>
          
          {/* Componente de logout */}
          <li><Logout /></li>
        </ul>
      </nav>
    </aside>
  );
}

