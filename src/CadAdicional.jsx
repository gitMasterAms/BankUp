// Importa o React e o Hook useState para gerenciar os valores dos campos
import React, { useState } from 'react';
import './styles/CadAdicional.css'; // Importa os estilos específicos da tela

function CadAdicional() {
  // Estados para armazenar os dados digitados pelo usuário
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Recupera o token salvo localmente
    const token = localStorage.getItem('authToken');

    // Monta o objeto com os dados do usuário
    const dados = {
      name,
      cpf_cnpj: cpfCnpj,
      phone,
      address,
      birthdate
    };

    try {
      // Envia os dados via POST para a API
      const response = await fetch('http://100.108.7.70:3000/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      const resultado = await response.json();

      // Exibe mensagem se houver
      if (resultado && resultado.msg) {
        alert(resultado.msg);
      } else {
        console.log('Erro ao cadastrar');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className="cadastro-adicional-pagina">
      <div className="cadastro-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h2 className="cadastro-titulo">ADD CADASTRO ADICIONAL</h2>

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

          <button type="submit">CADASTRAR</button>

        </form>
      </div>
    </div>
  );
}

export default CadAdicional;
