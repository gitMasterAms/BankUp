function AprendaSection() {
  return (
    <section className="aprenda" id="serviços">
      <h2>Aprenda com profissionais</h2>

      <div className="grid-cards">
        {/* Card 1 */}
        <div className="card">
          <img src="imagens/gerenciarDinheiro.png" alt="Gerenciar dinheiro" />
          <p>Aprenda de forma simples a gerenciar seu dinheiro obtido através do nosso sistema</p>
        </div>

        {/* Card 2 */}
        <div className="card">
          <img src="imagens/grafico-histograma.png" alt="Gráficos" />
          <p>Aprenda com gráficos se sua receita está crescendo</p>
        </div>

        {/* Card 3 */}
        <div className="card">
          <img src="imagens/suporte.png" alt="Suporte" />
          <p>Tenha acesso a uma equipe de suporte para tirar suas dúvidas</p>
        </div>

        {/* Card 4 */}
        <div className="card">
          <img src="imagens/calendario.png" alt="Calendário" />
          <p>Gerencie seu tempo de forma fácil, com acesso a um calendário</p>
        </div>

        {/* Card 5 */}
        <div className="card">
          <img src="imagens/aviso.png" alt="Avisos" />
          <p>Receba avisos de datas, eventos e muito mais!</p>
        </div>

        {/* Card 6 */}
        <div className="card">
          <img src="imagens/tag.png" alt="Tags" />
          <p>Divida facilmente seus serviços através de tags</p>
        </div>
      </div>
    </section>
  );
}

export default AprendaSection;
