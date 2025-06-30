function Header({ irParaPagina }) {
  return (
    <header className="cabecalho">
      <div className="logo">Bank<span>Up</span></div>
      <nav className="menu">
        <a href="#serviços" className="btn">Serviços</a>
        <a href="#" className="btn" onClick={() => irParaPagina('planos')}>Planos</a>
        <a href="#" className="btn" onClick={() => irParaPagina('login')}>Entrar</a>
        <a href="#" className="btn btn-secundario" onClick={() => irParaPagina('cadastro')}>Cadastrar</a>
      </nav>
    </header>
  );
}

export default Header;
