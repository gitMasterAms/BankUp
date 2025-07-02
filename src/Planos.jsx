import './styles/planos.css'; // Importando o CSS exclusivo da página de planos

function Planos() {
  return (
    <div className="precos-wrapper">
      {/* Título principal da página */}
      <h1 className="precos-titulo">Escolha o melhor preço</h1>

      {/* Container com os 3 cards de planos */}
      <div className="precos-cards">
        {/* Plano Grátis */}
        <div className="precos-card">
          <h2 className="precos-nome precos-gratis">Grátis</h2>
          <p className="precos-preco">R$0,00</p>
          <p className="precos-sub">6 MESES DE TESTE</p>
          <ul className="precos-lista">
            <li>GERENCIE TODOS OS SEUS CLIENTES <span className="precos-check">?</span></li>
            <li>CRIE TAGS ILIMITADAS PARA ORGANIZAR <span className="precos-check">?</span></li>
            <li>VEJA QUEM ESTÁ NO NEGATIVO <span className="precos-check">?</span></li>
            <li>MANDE MENSAGENS PERSONALIZADAS <span className="precos-check">?</span></li>
          </ul>
        </div>

        {/* Plano Básico */}
        <div className="precos-card">
          <h2 className="precos-nome precos-basico">Básico</h2>
          <p className="precos-preco">R$0,10</p>
          <p className="precos-sub">PARA PEQUENAS EMPRESAS</p>
          <ul className="precos-lista">
            <li>GERENCIE ATÉ 1.500 CLIENTES <span className="precos-check">?</span></li>
            <li>CRIE ATÉ 5 TAGS <span className="precos-check">?</span></li>
            <li>VEJA ATÉ 15 CLIENTES QUE ESTÃO NO NEGATIVO <span className="precos-check">?</span></li>
            <li>MANDE MENSAGENS PERSONALIZADAS <span className="precos-x">?</span></li>
          </ul>
        </div>

        {/* Plano Premium */}
        <div className="precos-card">
          <h2 className="precos-nome precos-premium">Premium</h2>
          <p className="precos-preco">R$1,00</p>
          <p className="precos-sub">PARA GRANDES EMPRESAS</p>
          <ul className="precos-lista">
            <li>GERENCIE TODOS OS SEUS CLIENTES <span className="precos-check">?</span></li>
            <li>CRIE TAGS ILIMITADAS PARA ORGANIZAR <span className="precos-check">?</span></li>
            <li>VEJA QUEM ESTÁ NO NEGATIVO <span className="precos-check">?</span></li>
            <li>MANDE MENSAGENS PERSONALIZADAS <span className="precos-check">?</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Planos;
