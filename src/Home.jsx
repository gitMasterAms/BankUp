// src/Home.jsx
import React from 'react';
import Sidebar from './components/Sidebar';
import './styles/Home.css'; // Importando o CSS separado

function Home() {
  return (
    <div className="home-container">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Conteúdo Central */}
      <div className="home-content">
        <h1 className="home-title">Bem-vindo à nossa Home</h1>
      </div>
    </div>
  );
}

export default Home;
