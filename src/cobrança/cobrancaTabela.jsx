import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Tabelas.css";
import { useNavigate } from "react-router-dom";

// Tabela de Cobranças com colunas solicitadas:
// valor, descrição, até a data (validade), Multa, PixKey, Juros ao mês
function CobrancaTabela() {
  const navigate = useNavigate();
  const [linhas, setLinhas] = useState([]);
  const [pagadores, setPagadores] = useState([]);

  useEffect(() => {
    // BACKEND: aqui você pode substituir localStorage por uma chamada GET /cobrancas
    const armazenadas = localStorage.getItem("cobrancas");
    setLinhas(armazenadas ? JSON.parse(armazenadas) : []);

    // BACKEND: carregar também os pagadores (GET /pagadores) para exibir o nome
    const listaPagadores = localStorage.getItem("pagadores");
    setPagadores(listaPagadores ? JSON.parse(listaPagadores) : []);
  }, []);

  // Mapa de id -> nome do pagador para resolver rápido o nome na tabela
  const pagadorIdParaNome = useMemo(() => {
    const mapa = {};
    for (const p of pagadores) {
      mapa[p.id] = p.nome;
    }
    return mapa;
  }, [pagadores]);

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <div className="main-content">
        <h2>Cobranças</h2>
        <div style={{ marginBottom: 12 }}>
          <button className="btn-salvar" onClick={() => navigate("/cobranca")}>Nova cobrança</button>
        </div>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Até a data</th>
                <th>Multa</th>
                <th>PixKey</th>
                <th>Juros ao mês</th>
                <th style={{ width: 90 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ color: "#888", padding: 12 }}>Nenhuma cobrança cadastrada.</td>
                </tr>
              )}
              {linhas.map((linha) => (
                <tr key={linha.id}>
                  <td>{pagadorIdParaNome[linha.pagadorId] || "-"}</td>
                  <td>{linha.valor}</td>
                  <td>{linha.descricao}</td>
                  <td>{linha.validade}</td>
                  <td>{linha.multa}</td>
                  <td>{linha.pixKey}</td>
                  <td>{linha.jurosMes}</td>
                  <td>
                    <div className="acoes">
                      <button
                        className="btn-icon"
                        title="Alterar"
                        aria-label="Alterar"
                        onClick={() => navigate("/cobranca", { state: { editId: linha.id } })}
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
                          const confirmDelete = confirm("Excluir esta cobrança?");
                          if (!confirmDelete) return;
                          const atualizadas = linhas.filter((c) => c.id !== linha.id);
                          setLinhas(atualizadas);
                          // BACKEND: aqui você pode chamar DELETE /cobrancas/:id
                          localStorage.setItem("cobrancas", JSON.stringify(atualizadas));
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

export default CobrancaTabela;


