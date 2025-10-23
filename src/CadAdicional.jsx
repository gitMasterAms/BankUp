import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInput } from './components/Input'; // Preservando a importação do custom hook
import './styles/CadAdicional.css';
import { API_URL } from './config/api';

function CadAdicional() {
  // 1. Estados usando o custom hook useInput (para mascaramento e props do input)
  // O useInput é modificado para retornar também uma função para definir o valor.
  // Se o seu useInput não retornar setValue, adapte a desestruturação.
  const [nameProps, setNameValue] = useInput();
  const [cpfCnpjProps, setCpfCnpjValue] = useInput("", "###.###.###-##"); // Máscara de CPF
  const [phoneProps, setPhoneValue] = useInput("", "(##) #####-####");   // Máscara de Telefone
  const [addressProps, setAddressValue] = useInput();
  
  // Estado simples para Data de Nascimento (input type="date" não usa máscara)
  const [birthdate, setBirthdate] = useState('');

  // Estados de controle da infraIntegrations
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // 2. useEffect para buscar dados existentes (Modo de Edição)
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
          
          if (data && data.name) { 
            setIsEditing(true);
            
            // Pré-preenche o formulário usando as funções setValue do useInput
            setNameValue(data.name || '');
            setCpfCnpjValue(data.cpf_cnpj || '');
            setPhoneValue(data.phone || '');
            setAddressValue(data.address || '');
            
            // Formata a data para 'YYYY-MM-DD'
            if (data.birthdate) {
              const dateOnly = data.birthdate.split('T')[0];
              setBirthdate(dateOnly);
            }
          }
        } 
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]); 

  // 3. Função de Submissão (POST ou PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    // Define o método baseado no estado isEditing
    const httpMethod = isEditing ? 'PATCH' : 'POST'; 
    
    // Pega os valores atuais dos props retornados pelo useInput
    const dados = {
      name: nameProps.value,
      cpf_cnpj: cpfCnpjProps.value, // O valor retornado pelo useInput já é o mascarado/limpo
      phone: phoneProps.value,
      address: addressProps.value,
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

  // 4. Renderização (usando o spread operator para passar as props do useInput)
  return (
    <div className="cadastro-adicional-pagina">
      <div className="cadastro-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h2 className="cadastro-titulo">
            {isEditing ? 'Editar Perfil' : 'Cadastro Adicional'}
          </h2>

          <label htmlFor="name">Nome</label>
          <input type="text" id="name" {...nameProps} required />

          <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
          {/* O useInput aplica o mascaramento automaticamente aqui */}
          <input type="text" id="cpf_cnpj" {...cpfCnpjProps} required />

          <label htmlFor="phone">Telefone</label>
          {/* O useInput aplica o mascaramento automaticamente aqui */}
          <input type="text" id="phone" {...phoneProps} required />

          <label htmlFor="address">Endereço</label>
          <input type="text" id="address" {...addressProps} required />

          <label htmlFor="birthdate">Data de Nascimento</label>
          <input 
            type="date" 
            id="birthdate" 
            value={birthdate} 
            onChange={(e) => setBirthdate(e.target.value)} 
            required 
          />

          <button type="submit">
            {isEditing ? 'Atualizar Perfil' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadAdicional;