import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInput } from './components/Input';
import './styles/CadAdicional.css';
import { API_URL } from './config/api';

function CadAdicional() {
  const [nameProps] = useInput();
  const [cpfCnpjProps] = useInput("", "###.###.###-##");
  const [phoneProps] = useInput("", "(##) #####-####");
  const [addressProps] = useInput();
  const [birthdate, setBirthdate] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // chave do token padronizada

    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    const dados = {
      name: nameProps.value,
      cpf_cnpj: cpfCnpjProps.value,
      phone: phoneProps.value,
      address: addressProps.value,
      birthdate: birthdate,
    };

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (response.ok) {
        alert('Cadastro adicional realizado com sucesso!');
        
        // Após o cadastro ser concluído com sucesso, redireciona para a página de Planos
        localStorage.setItem('profile_complete', 'true');  // Atualiza o status do perfil para completo
        navigate('/home'); // Redireciona para a página de home
      } else {
        alert(resultado.msg || 'Erro ao enviar cadastro adicional.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="cadastro-adicional-pagina">
      <div className="cadastro-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h2 className="cadastro-titulo">Cadastro Adicional</h2>

          <label htmlFor="name">Nome</label>
          <input type="text" id="name" value={nameProps.value} onChange={nameProps.onChange} required />

          <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
          <input type="text" id="cpf_cnpj" value={cpfCnpjProps.value} onChange={cpfCnpjProps.onChange} required />

          <label htmlFor="phone">Telefone</label>
          <input type="text" id="phone" value={phoneProps.value} onChange={phoneProps.onChange} required />

          <label htmlFor="address">Endereço</label>
          <input type="text" id="address" value={addressProps.value} onChange={addressProps.onChange} required />

          <label htmlFor="birthdate">Data de Nascimento</label>
          <input type="date" id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CadAdicional;
