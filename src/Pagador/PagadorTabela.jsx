import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "../styles/Tabelas.css";

// Tabela de Pagadores com colunas solicitadas:
// nome, descrição, cpf/cnpj, email, telefone
function PagadorTabela() {
  const navigate = useNavigate();
  const [linhas, setLinhas] = useState([]);

  // Carrega da storage ao abrir
  useEffect(() => {
    const armazenados = localStorage.getItem("pagadores");
    if (armazenados) {
      setLinhas(JSON.parse(armazenados));
    } else {
      setLinhas([]);
    }
  }, []);

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <div className="main-content">
        <h2>Pagadores</h2>
        <div style={{ marginBottom: 12 }}>
          <button className="btn-salvar" onClick={() => navigate("/cadclientes")}>Novo pagador</button>
        </div>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>CPF/CNPJ</th>
                <th>Email</th>
                <th>Telefone</th>
                <th style={{ width: 90 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "#888", padding: 12 }}>Nenhum pagador cadastrado.</td>
                </tr>
              )}
              {linhas.map((linha) => (
                <tr key={linha.id}>
                  <td>{linha.nome}</td>
                  <td>{linha.descricao}</td>
                  <td>{linha.cpfCnpj}</td>
                  <td>{linha.email}</td>
                  <td>{linha.telefone}</td>
                  <td>
                    <div className="acoes">
                      <button
                        className="btn-icon"
                        title="Alterar"
                        aria-label="Alterar"
                        onClick={() => navigate("/cadclientes", { state: { editId: linha.id } })}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        title="Excluir"
                        aria-label="Excluir"
                        onClick={() => {
                          const confirmDelete = confirm("Excluir este pagador?");
                          if (!confirmDelete) return;
                          const atualizados = linhas.filter((p) => p.id !== linha.id);
                          setLinhas(atualizados);
                          localStorage.setItem("pagadores", JSON.stringify(atualizados));
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29 10.59 10.6l6.3-6.31z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PagadorTabela;


