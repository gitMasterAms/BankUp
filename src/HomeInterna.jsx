import React from "react";
import SidebarLayout from "./components/SidebarLayout";
import "./styles/HomeInterna.css";

export default function HomeInterna() {
  return (
    <SidebarLayout>
      {/* Adicione a classe 'home-content' para aplicar os estilos de layout corretos */}
      <div className="home-content"> 
        {/* Seção principal com foco no conteúdo animado */}
        <section className="hero">
          <span className="badge">Novo</span>
          <h1 className="typewriter">
            Eleve seu dinheiro com a <span className="highlight">BankUp</span>
          </h1>
          <p className="subtitle">
            Controle inteligente, insights em tempo real e ferramentas que fazem seu
            dinheiro trabalhar por você.
          </p>
          <ul className="benefits">
            <li>• Metas automáticas e lembretes inteligentes</li>
            <li>• Relatórios claros e personalizáveis</li>
            <li>• Segurança nível bancário</li>
          </ul>
        </section>
      </div>
    </SidebarLayout>
  );
}