import React from "react";
import { useNavigate } from "react-router-dom";
import "./SobreNos.css";

// Lista de membros
const membros = [
  {
    nome: "Ana Caroline",
    cargo: "Scrum Master Frontend",
    foto: "/imagens/FotosLink/AnaCaroline.jpg",
    linkedin: "https://www.linkedin.com/in/ana-caroline-mendes-pires-496bb72b7/"
  },
  {
    nome: "Miguel Antonio",
    cargo: "Scrum Master Geral",
    foto: "/imagens/FotosLink/Miguel.jpg",
    linkedin: "https://www.linkedin.com/in/miguel-antonio-pereira-ribeiro/"
  },
  {
    nome: "Eduardo Soldi",
    cargo: "PO Infraestrutura",
    foto: "/imagens/FotosLink/Eduardo.png",
    linkedin: "https://www.linkedin.com/in/eduardosoldi/"
  },
 {
    nome: "Vitor Capeletti",
    cargo: "Scrum Master Backend",
    foto: "/imagens/FotosLink/Vitor.jpg",
    linkedin: "https://www.linkedin.com/in/vitor-capeleti/"
  },
   {
    nome: "Sabrina Freitas",
    cargo: "Scrum Master infraestrutura",
    foto: "/imagens/FotosLink/Sabrina.jpg",
    linkedin: "https://www.linkedin.com/in/sabrinafreitasdev"
  },
  
  {
    nome: "Kevin Lopes Araújo",
    cargo: "UI/UX Developer Mobile",
    foto: "/imagens/FotosLink/Kevin.jpg",
    linkedin: "https://www.linkedin.com/in/kevin-ara%C3%BAjo-a99278383/"
  },
  {
    nome: "Thaís Simon",
    cargo: "PO Frontend/Dev Mobile",
    foto: "/imagens/FotosLink/Thais-Simon.png",
    linkedin: "https://www.linkedin.com/in/thais-simon/"
  },
  
  {
    nome: "Maria Rita",
    cargo: "Dev Team Backend",
    foto: "/imagens/FotosLink/MariaRita.jpg",
    linkedin: "https://www.linkedin.com/in/mariaoliveiraemp"
  },
  {
    nome: "Tais Ferreira",
    cargo: "PO Backend",
    foto: "/imagens/FotosLink/TaisFerreira.jpg",
    linkedin: "https://www.linkedin.com/in/ta%C3%ADs-ferreira-de-faria-949606338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  {
    nome: "Gustavo Nerone",
    cargo: "Dev Team Infraestrutura",
    foto: "/imagens/FotosLink/Gustavo.jpg",
    linkedin: "https://www.linkedin.com/in/gustavo-nerone-de-carvalho-6a2ba42b6/"
  },
  {
    nome: "Nicolas Gmack",
    cargo: "Dev Team Backend",
    foto: "/imagens/FotosLink/Nicolas.jpg",
    linkedin: "https://www.linkedin.com/in/nicolasgmack"
  },
  {
    nome: "Claudio Henrrique",
    cargo: "Dev Mobile/QA",
    foto: "/imagens/FotosLink/Claudio.jpg",
    linkedin: "https://www.linkedin.com/in/claudio-henrique-49a224337/"
  },
  {
    nome: "Maria Imaculada",
    cargo: "UI/UX Designer",
    foto: "/imagens/FotosLink/MariaImaculada.jpg",
    linkedin: "https://www.linkedin.com/in/maria-castilho-silva-3aa493383/"
  },
  {
    nome: "Kauã Elker",
    cargo: "Dev Infraestrutura",
    foto: "/imagens/FotosLink/Kaua.jpg",
    linkedin: "https://www.linkedin.com/in/kau%C3%A3-elker-moreira-"
  },
];

export default function SobreNos() {
  const navigate = useNavigate();
  return (
    <div className="sobre-container">
      <h2 className="titulo"> <span className="highlight">NOSSO TIME</span></h2>
      
      <p className="subtitulo2"> O BankUp é uma plataforma web criada para automatizar pagamentos e cobranças, buscando reduzir a inadimplência no Brasil e oferecer previsibilidade orçamentária a empreendedores e autônomos. O projeto visa democratizar o acesso a ferramentas de gestão financeira.
        <br /><br />
                  O método adotado foi a criação de uma plataforma intuitiva que automatiza cobranças, integrando notificações por WhatsApp/e-mail e pagamentos via Pix. A simplicidade e a automação de tarefas repetitivas são pilares, atendendo pequenos negócios com recursos limitados.
        <br /><br />
                  Como resultado, o BankUp proporciona uma gestão de recebíveis mais prática e eficiente, contribuindo diretamente para a redução da inadimplência e a otimização dos processos de cobrança. Seu propósito é remover barreiras técnicas e financeiras, permitindo que qualquer negócio profissionalize sua gestão.</p>
      <p className="subtitulo">Turma de Analise e Desenvolvimento de Sistemas da Fatec Taubaté 2025</p>
      <div className="voltar-home">
        <button className="home-button" onClick={() => navigate("/")}>← Voltar à Página Inicial</button>
      </div>

      <div className="grid">
        {membros.map((m, index) => (
          <div
            key={index}
            className="card"
            onClick={() => window.open(m.linkedin, "_blank")}
          >
            <div 
              className="avatar" 
              style={{ backgroundImage: `url(${m.foto})` }}
            ></div>
            <div className="info">
              <h3>{m.nome}</h3>
              <p>{m.cargo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
