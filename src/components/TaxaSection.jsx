function TaxaSection() {
  // Valores fixos para demonstração (taxa de 0,01%)
  const valores = [
    { valor: 'R$ 100,00', taxa: '0,01%', desconto: 'R$ 0,01', recebe: 'R$ 99,99' },
    { valor: 'R$ 500,00', taxa: '0,01%', desconto: 'R$ 0,05', recebe: 'R$ 499,95' },
    { valor: 'R$ 1.000,00', taxa: '0,01%', desconto: 'R$ 0,10', recebe: 'R$ 999,90' },
    { valor: 'R$ 5.000,00', taxa: '0,01%', desconto: 'R$ 0,50', recebe: 'R$ 4.999,50' },
    { valor: 'R$ 10.000,00', taxa: '0,01%', desconto: 'R$ 1,00', recebe: 'R$ 9.999,00' },
    { valor: 'R$ 50.000,00', taxa: '0,01%', desconto: 'R$ 5,00', recebe: 'R$ 49.995,00' },
    { valor: 'R$ 100.000,00', taxa: '0,01%', desconto: 'R$ 10,00', recebe: 'R$ 99.990,00' },
    { valor: 'R$ 1.000.000,00', taxa: '0,01%', desconto: 'R$ 100,00', recebe: 'R$ 999.900,00' },
  ];

  return (
    <section className="taxa-section">
      <div className="taxa-container">
        {/* Texto promocional à esquerda */}
        <div className="taxa-texto">
          <h2>
            Não importa se é R$100,00 ou R$1.000.000,00. Nossos clientes pagam apenas{' '}
            <span className="taxa-destaque">0,01%</span> por transação.
          </h2>
          <p>
            Nada de promoções ou limites escondidos. Todas as suas transações custam sempre{' '}
            <span className="taxa-destaque">0,01%</span> no BankUp.
          </p>
        </div>

        {/* Tabela à direita */}
        <div className="taxa-tabela-wrapper">
          <table className="taxa-tabela">
            <thead>
              <tr>
                <th>Valor da Transação</th>
                <th>Taxa</th>
                <th>Desconto</th>
                <th>Você Recebe</th>
              </tr>
            </thead>
            <tbody>
              {valores.map((item, index) => (
                <tr key={index}>
                  <td>{item.valor}</td>
                  <td className="taxa-valor">{item.taxa}</td>
                  <td>R$ {item.desconto}</td>
                  <td className="taxa-recebe">{item.recebe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default TaxaSection;

