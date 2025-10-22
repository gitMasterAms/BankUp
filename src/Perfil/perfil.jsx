import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import SidebarLayout from '../components/SidebarLayout';
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

  // Determina se o perfil adicional (nome, cpf, etc.) foi preenchido.
  // Usamos 'name' como o campo chave para verificar se há dados.
  const isProfileComplete = !!userData.name; 

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
        const profileResponse = await fetch(`${API_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          
          setUserData({
            email: profileData.email || '',
            name: profileData.name || '',
            cpf_cnpj: profileData.cpf_cnpj || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
            birthdate: profileData.birthdate || ''
          });
        } else if (profileResponse.status === 404) {
          // Trata caso a API retorne 404 para perfil não encontrado (primeiro acesso)
          // Tenta buscar o email separadamente se necessário, mas mantemos o estado limpo
          const errorData = await profileResponse.json();
          console.log('Perfil não encontrado, aguardando cadastro adicional:', errorData);
          // O email deve ser buscado de outra fonte ou estar no token.
          // Por simplicidade, assumimos que o email vazio será 'Não informado' até o login.
        } else {
          const errorData = await profileResponse.json();
          throw new Error(errorData.msg || 'Falha ao carregar os dados do perfil.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError(error.message || 'Erro ao carregar dados do perfil');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Função para editar/completar perfil (informações adicionais)
  const handleEditProfile = () => {
    navigate('/cadAdicional');
  };

  // Função para editar dados básicos (pode incluir email/senha)
  const handleEditBasicData = () => {
    navigate('/cadastro');
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="perfil-container">
          <div className="perfil-loading">
            <div className="loading-spinner"></div>
            <p>Carregando dados do perfil...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="perfil-container">
          <div className="perfil-error">
            <h2>Erro ao carregar perfil</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Tentar novamente</button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="perfil-container">
      

        <div className="perfil-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e configurações da conta</p>
        </div>

        <div className="perfil-content">
          {/* Seção de Informações Básicas */}
          <div className="perfil-section">
            <div className="section-header">
              <h2>Informações Básicas</h2>
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
              {/* BOTAO DINÂMICO AQUI */}
              <button 
                className="edit-button"
                onClick={handleEditProfile}
              >
                {isProfileComplete ? 'Editar' : 'Completar Cadastro'}
              </button>
            </div>
            {
              // MOSTRA AS INFORMAÇÕES OU UMA MENSAGEM
              isProfileComplete ? (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nome:</label>
                    <span>{userData.name}</span>
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
              ) : (
                <div className="profile-incomplete-message">
                  <p>Seu perfil está incompleto! Clique no botão "Completar Cadastro" para adicionar suas informações pessoais e liberar todos os recursos.</p>
                </div>
              )
            }
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}

export default Perfil;