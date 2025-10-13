import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import './perfil.css';

function Perfil() {
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    cpf_cnpj: '',
    phone: '',
    address: '',
    birthdate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Busca os dados do usuário ao carregar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
       if (!token) {
         alert('Usuário não autenticado. Faça login novamente.');
          navigate('/login');
          return;
       }

      try {
      
        // Busca dados básicos do usuário (email)
          const userResponse = await fetch(`${API_URL}/user/check`, {
           method: 'GET',
           headers: {
             'Authorization': `Bearer ${token}`,
           },
          });

           if (userResponse.ok) {
            const userInfo = await userResponse.json();
              setUserData(prev => ({ ...prev, email: userInfo.email || '' }));
          }

        // Busca dados do perfil (informações adicionais)
          const profileResponse = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
              setUserData(prev => ({
         ...prev,
              name: profileData.name || '',
              cpf_cnpj: profileData.cpf_cnpj || '',
              phone: profileData.phone || '',
              address: profileData.address || '',
              birthdate: profileData.birthdate || ''
            }));
          }

        // DADOS DE EXEMPLO PARA VISUALIZAÇÃO DA TELA
        setUserData({
          email: 'usuario@exemplo.com',
          name: 'João Silva',
          cpf_cnpj: '123.456.789-00',
          phone: '(11) 99999-9999',
          address: 'Rua das Flores, 123 - São Paulo/SP',
          birthdate: '1990-05-15'
        });

        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError('Erro ao carregar dados do perfil');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Função para editar perfil
  const handleEditProfile = () => {
    navigate('/cadAdicional');
  };

  // Função para editar dados básicos
  const handleEditBasicData = () => {
    navigate('/cadastro');
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="perfil-loading">
          <div className="loading-spinner"></div>
          <p>Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-container">
        <div className="perfil-error">
          <h2>Erro ao carregar perfil</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      {/* Botão para voltar à home */}
      <div className="voltar-home">
        <button className="home-button" onClick={() => navigate('/home')}>
          ← Voltar à Home
        </button>
      </div>

      <div className="perfil-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais e configurações da conta</p>
      </div>

      <div className="perfil-content">
        {/* Seção de Informações Básicas */}
        <div className="perfil-section">
          <div className="section-header">
            <h2>Informações Básicas</h2>
            <button 
              className="edit-button"
              onClick={handleEditBasicData}
            >
              Editar
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Email:</label>
              <span>{userData.email || 'Não informado'}</span>
            </div>
          </div>
        </div>

        {/* Seção de Informações Pessoais */}
        <div className="perfil-section">
          <div className="section-header">
            <h2>Informações Pessoais</h2>
            <button 
              className="edit-button"
              onClick={handleEditProfile}
            >
              Editar
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Nome:</label>
              <span>{userData.name || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>CPF/CNPJ:</label>
              <span>{userData.cpf_cnpj || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>Telefone:</label>
              <span>{userData.phone || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>Endereço:</label>
              <span>{userData.address || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <label>Data de Nascimento:</label>
              <span>{userData.birthdate ? new Date(userData.birthdate).toLocaleDateString('pt-BR') : 'Não informado'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Perfil;
