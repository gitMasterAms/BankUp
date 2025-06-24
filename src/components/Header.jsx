function Header() {
  return (
    <header className="cabecalho">
      <div className="logo">Bank<span>Up</span></div>
      <nav className="menu">
        <a href="#serviços" className="btn">Serviços</a>
        <a href="planos.html" className="btn">Planos</a>
        <a href="login.html" className="btn">Entrar</a>
        <a href="cadastro.html" className="btn btn-secundario">Cadastrar</a>
      </nav>
    </header>
  );
}

export default Header;
