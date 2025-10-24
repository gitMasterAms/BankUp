function CaloteSection() {
  return (
    <section className="chega-de-calote">
      <h2>Chega de calote</h2>
      <p>
        Com o BankUp integrado ao WhatsApp, você pode automatizar o pagamento de contas,
        simplificar o gerenciamento financeiro e oferecer aos jovens usuários um início
        inteligente e responsável no setor bancário.
      </p>

      <div className="imagens-calote">
        <div className="fundoOval hidden">
          <img className="mao" src="/imagens/dinheiroMao.png" alt="Dinheiro na mão" />
        </div>
        <div className="fundoOval hidden">
          <img className="pessoa" src="/imagens/pessoaFeliz.png" alt="Pessoa feliz" />
        </div>
        <div className="fundoOval">
          <img className="chave" src="/imagens/chave.png" alt="Chave sendo entregue" />
        </div>
      </div>

      <p>
        A cobrança que não desgasta sua relação com o cliente vem daqui, pare de correr atrás de pagamentos,
        seu serviço tem valor. Nossa ferramenta faz seus clientes entenderem isso.
      </p>
    </section>
  );
}

export default CaloteSection;
