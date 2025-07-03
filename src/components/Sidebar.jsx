import React from 'react';
import { FaHome, FaBell, FaRegFileAlt, FaUsers, FaPlus, FaChartBar, FaFolderOpen } from 'react-icons/fa';
import '.style/home.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">BankUp</h2>

      <nav className="sidebar-nav">
        <a href="#" className="nav-item"><FaHome /> Home</a>
        <a href="#" className="nav-item"><FaBell /> Notificações</a>
        <a href="#" className="nav-item"><FaRegFileAlt /> Seu plano</a>

        <p className="nav-section">Cobranças</p>
        <a href="#" className="nav-item"><FaRegFileAlt /> Todas</a>

        <p className="nav-section">Clientes</p>
        <a href="#" className="nav-item"><FaUsers /> Meus Clientes</a>
        <a href="#" className="nav-item"><FaPlus /> Cadastrar Cliente</a>

        <p className="nav-section">Estatísticas</p>
        <a href="#" className="nav-item"><FaChartBar /> Gráficos</a>
        <a href="#" className="nav-item"><FaFolderOpen /> Histórico</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
