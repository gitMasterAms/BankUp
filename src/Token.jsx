import './styles/token.css';

function Token({ irParaPagina }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você pode adicionar validações do código futuramente
    alert('Código verificado com sucesso!');

    // Após a verificação, redireciona para o cadastro adicional
    irParaPagina('cadAdicional');
  };

  return (
    <div className="tela-token">
      <div className="token-container">
        <h2 className="token-titulo">Verificação de Segurança</h2>
        <p className="token-subtexto">
          Enviamos um código para seu e-mail. Digite-o abaixo para continuar.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="codigo">Código de Verificação</label>
          <input
            type="text"
            id="codigo"
            placeholder="Digite o código recebido"
            required
          />
          <button type="submit" className="btn-verificar">Verificar</button>
        </form>
      </div>
    </div>
  );
}

export default Token;
