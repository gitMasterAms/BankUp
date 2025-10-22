import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/CadAdicional.css';
import { API_URL } from './config/api';

function CadAdicional() {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  
  // Estado para controlar se estamos em modo de edição (o perfil já existe)
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // 1. useEffect para buscar dados existentes (Modo de Edição)
  useEffect(() => {
    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Se a API retornar dados, entramos no modo de edição
          if (data && data.name) { 
            setIsEditing(true);
            
            // Pré-preenche o formulário
            setName(data.name || '');
            setCpfCnpj(data.cpf_cnpj || '');
            setPhone(data.phone || '');
            setAddress(data.address || '');
            
            // Formata a data para 'YYYY-MM-DD'
            if (data.birthdate) {
              const dateOnly = data.birthdate.split('T')[0];
              setBirthdate(dateOnly);
            }
          }
        } 
        // Em caso de 404 ou erro de parse, isEditing permanece false, 
        // indicando que é um novo cadastro (POST)
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]); 

  // 2. Função de Submissão (POST ou PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    // Define o método baseado no estado isEditing
    const httpMethod = isEditing ? 'PATCH' : 'POST'; 
    
    const dados = {
      name,
      cpf_cnpj: cpfCnpj,
      phone,
      address,
      birthdate,
    };

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: httpMethod, // Usa PATCH ou POST
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (response.ok) {
        const successMsg = isEditing 
          ? 'Perfil atualizado com sucesso!' 
          : 'Cadastro adicional realizado com sucesso!';

        alert(successMsg);
        
        // Marca o perfil como completo
        localStorage.setItem('profile_complete', 'true');
        navigate('/home'); 
      } else {
        alert(resultado.msg || `Erro ao ${isEditing ? 'atualizar' : 'enviar'} o cadastro.`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  // Exibe tela de carregamento
  if (loading) {
    return (
      <div className="cadastro-adicional-pagina">
        <div className="cadastro-wrapper">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-adicional-pagina">
      <div className="cadastro-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h2 className="cadastro-titulo">
            {isEditing ? 'Editar Perfil' : 'Cadastro Adicional'}
          </h2>

          <label htmlFor="name">Nome</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

          <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
          <input type="text" id="cpf_cnpj" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} required />

          <label htmlFor="phone">Telefone</label>
          <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <label htmlFor="address">Endereço</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />

          <label htmlFor="birthdate">Data de Nascimento</label>
          <input type="date" id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />

          <button type="submit">
            {isEditing ? 'Atualizar Perfil' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadAdicional;