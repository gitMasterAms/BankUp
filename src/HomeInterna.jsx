import React from "react";
import SidebarLayout from "./components/SidebarLayout";
import "./styles/HomeInterna.css";

export default function HomeInterna() {
  return (
    <SidebarLayout>
      {/* Seção principal com foco no conteúdo animado */}
      <section className="hero">
        {/* Selo de destaque para novidades/recursos */}
        <span className="badge">Novo</span>

        {/* Título principal com efeito de digitação */}
        <h1 className="typewriter">
          Eleve seu dinheiro com a <span className="highlight">BankUp</span>
        </h1>

        {/* Subtítulo com animação suave de entrada */}
        <p className="subtitle">
          Controle inteligente, insights em tempo real e ferramentas que fazem seu
          dinheiro trabalhar por você.
        </p>

        {/* Lista de benefícios sucinta (sem botões) */}
        <ul className="benefits">
          <li>• Metas automáticas e lembretes inteligentes</li>
          <li>• Relatórios claros e personalizáveis</li>
          <li>• Segurança nível bancário</li>
        </ul>
      </section>
    </SidebarLayout>
  );
}
