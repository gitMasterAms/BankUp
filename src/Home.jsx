// src/pages/Home.jsx
import React from 'react';
import Sidebar from './components/Sidebar';

function Home() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '230px', padding: '20px', width: '100%' }}>
        <h1>Bem-vindo à Home do BankUp</h1>
        <p>Esta é sua dashboard principal.</p>
      </div>
    </div>
  );
}

export default Home;
