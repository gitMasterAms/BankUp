import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBell, FaChartBar, FaHistory, FaUserPlus, FaFileAlt } from "react-icons/fa";
import "../styles/Sidebar.css"; // CSS separado

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        BankUp
      </div>
      <nav>
        <ul>
          <li><Link to="/home"><FaHome /> Casa</Link></li>
          <li><FaBell /> Notificações</li>
          <li><FaFileAlt /> Seu plano</li>
          <span className="section-title">Estatísticas</span>
          <li><FaChartBar /> Gráficos</li>
          <li><FaHistory /> Cobranças</li>
          {/* 🔗 Agora o botão abre o Cadastro de Clientes */}
          <li><Link to="/cadclientes"><FaUserPlus /> Cadastrar clientes</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

