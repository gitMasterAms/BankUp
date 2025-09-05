import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/CadAdicional.css';

function CadAdicional() {
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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
      name,
      cpf_cnpj: cpfCnpj,
      phone,
      address,
      birthdate,
    };

    try {
      const response = await fetch('/api/user/profile', {
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
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

          <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
          <input type="text" id="cpf_cnpj" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} required />

          <label htmlFor="phone">Telefone</label>
          <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <label htmlFor="address">Endereço</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />

          <label htmlFor="birthdate">Data de Nascimento</label>
          <input type="date" id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CadAdicional;
