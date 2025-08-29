import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./styles/CadClientes.css";

function CadastrarCliente() {
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "Aluguel",
    cpfCnpj: "",
    cep: "",
    email: "",
    endereco: "",
    telefone: ""
  });

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Salvar (simples por enquanto, só console.log)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cliente cadastrado:", formData);
    alert("Cliente cadastrado com sucesso!");
  };

  return (
    <div className="cadastro-container">
      <h2>Dados do Cliente</h2>
      <p className="info">
        Ao criar um cliente você deve criar uma cobrança para que este receba a
        notificação devida
      </p>

      <form className="form-cadastro" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="nome"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={handleChange}
          />
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          >
            <option value="Aluguel">Aluguel</option>
            <option value="Serviço">Serviço</option>
            <option value="Produto">Produto</option>
          </select>
        </div>

        <div className="form-row">
          <input
            type="text"
            name="cpfCnpj"
            placeholder="CPF/CNPJ"
            value={formData.cpfCnpj}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            value={formData.cep}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="endereco"
            placeholder="Endereço (Cidade, Bairro, Número)"
            value={formData.endereco}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-salvar">Salvar</button>
          <button type="button" className="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarCliente;
