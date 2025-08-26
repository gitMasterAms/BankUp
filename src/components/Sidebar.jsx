import React from "react";
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
          <li><FaHome /> Casa</li>
          <li><FaBell /> Notificações</li>
          <li><FaFileAlt /> Seu plano</li>
          <span className="section-title">Estatísticas</span>
          <li><FaChartBar /> Gráficos</li>
          <li><FaHistory /> Cobranças</li>
          <li><FaUserPlus /> Cadastrar clientes</li>
        </ul>
      </nav>
    </aside>
  );
}
