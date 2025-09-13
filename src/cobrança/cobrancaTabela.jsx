import React, { useEffect, useMemo, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import "../styles/Tabelas.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
 
// Tabela de Cobranças com colunas solicitadas:
// valor, descrição, até a data (validade), Multa, PixKey
function CobrancaTabela() {
  const navigate = useNavigate();
  const [linhas, setLinhas] = useState([]);
  const [pagadores, setPagadores] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
 
        // Buscar cobranças
        const paymentsResponse = await fetch(`${API_URL}/financial/payments`, {
          headers
        });
        const paymentsData = await paymentsResponse.json();
       
        // Buscar pagadores
        const pagadoresResponse = await fetch(`${API_URL}/financial/recurring`, {
          headers
        });
        const pagadoresData = await pagadoresResponse.json();
 
        setPagadores(pagadoresData.map(item => ({
          id: item.account_id,
          nome: item.name
        })));
 
        console.log('Dados recebidos:', paymentsData);
        setLinhas(paymentsData.map(payment => {
          console.log('Processando pagamento:', payment);
          return {
            id: payment.payment_id, // Campo usado para delete
            pagadorId: payment.account_id,
            valor: payment.amount,
            descricao: payment.description,
            validade: payment.due_date,
            multa: payment.penalty,
            pixKey: payment.pix_key
          };
        }));
 
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLinhas([]);
        setPagadores([]);
      }
    };
 
    fetchData();
  }, []);
 
  // Mapa de id -> nome do pagador para resolver rápido o nome na tabela
  const pagadorIdParaNome = useMemo(() => {
    const mapa = {};
    for (const p of pagadores) {
      mapa[p.id] = p.nome;
    }
    return mapa;
  }, [pagadores]);
 
   function formatDateBR(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
   
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
 
    return `${day}/${month}/${year}`;
  }
 
  return (
    <SidebarLayout>
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
                <th style={{ width: 90 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "#888", padding: 12 }}>Nenhuma cobrança cadastrada.</td>
                </tr>
              )}
              {linhas.map((linha, index) => (
                <tr key={`payment-${linha.id || index}`}>
                  <td>{pagadorIdParaNome[linha.pagadorId] || "-"}</td>
                  <td>{linha.valor}</td>
                  <td>{linha.descricao}</td>
                  <td>{formatDateBR(linha.validade)}</td>
                  <td>{linha.multa}</td>
                  <td>{linha.pixKey}</td>
                  <td>
                    <div className="acoes">
                      <button
                        className="btn-icon"
                        title="Alterar"
                        aria-label="Alterar"
                        onClick={() => {
                          const cobranca = linhas.find(c => c.id === linha.id);
                          if (cobranca) {
                            navigate("/cobranca", {
                              state: {
                                editId: linha.id,
                                cobranca: {
                                  ...cobranca,
                                  pagador: pagadorIdParaNome[cobranca.pagadorId]
                                }
                              }
                            });
                          }
                        }}
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
                          if (!linha.id) {
                            alert('ID da cobrança não encontrado');
                            return;
                          }
 
                          const confirmDelete = confirm("Excluir esta cobrança?");
                          if (!confirmDelete) return;
                          
                          console.log('Tentando deletar pagamento com ID:', linha.id);
                          
                          fetch(`${API_URL}/financial/payments/${linha.id}`, {
                            method: 'DELETE',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            }
                          })
                          .then(async response => {
                            const text = await response.text();
                            console.log('Resposta do servidor:', response.status, text);
                            
                            if (response.ok) {
                              setLinhas(linhas.filter(c => c.id !== linha.id));
                              alert('Cobrança excluída com sucesso!');
                              return;
                            }
                            
                            let errorMessage = 'Erro ao excluir cobrança';
                            try {
                              const errorData = JSON.parse(text);
                              errorMessage = errorData.msg || errorMessage;
                            } catch (e) {
                              errorMessage = text || errorMessage;
                            }
                            
                            throw new Error(errorMessage);
                          })
                          .catch(error => {
                            console.error('Erro ao excluir cobrança:', error);
                            alert(error.message);
                          });
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
    </SidebarLayout>
  );
}
 
export default CobrancaTabela;