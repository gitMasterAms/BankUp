import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/token.css';
import { API_URL } from '../config/api';

function VerificarCodigo() {
  const [codigo, setCodigo] = useState('');
  const [validando, setValidando] = useState(false);
  const navigate = useNavigate();
  // Modo simulado para navegar sem backend. Quando true, não faz requisições reais.
  const MOCK = true;

  const email = localStorage.getItem('reset_email');

  const handleVerificar = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('E-mail não identificado. Volte e informe seu e-mail.');
      navigate('/esquecer-senha');
      return;
    }

    try {
      setValidando(true);

      if (MOCK) {
        // Simulação: confere com o código salvo no passo anterior
        const esperado = localStorage.getItem('reset_code');
        setTimeout(() => {
          if (codigo === esperado) {
            // Gera um token temporário simulado
            const temp = 'mock-reset-token';
            localStorage.setItem('reset_token', temp);
            alert('Código verificado (simulado).');
            navigate('/redefinir-senha');
          } else {
            alert('Código inválido (simulado).');
          }
          setValidando(false);
        }, 600);
        return;
      }

      // Fluxo real (quando tiver backend)
      const resposta = await fetch(`${API_URL}/user/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codigo }),
      });

      if (resposta.ok) {
        const data = await resposta.json();
        if (data.resetToken) {
          localStorage.setItem('reset_token', data.resetToken);
        }
        alert('Código verificado! Defina sua nova senha.');
        navigate('/redefinir-senha');
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Código inválido ou expirado.');
      }
    } catch (err) {
      console.error('Erro ao verificar código de recuperação:', err);
      alert('Erro de conexão com o servidor.');
    } finally {
      if (!MOCK) setValidando(false);
    }
  };

  const reenviar = async () => {
    if (!email) {
      alert('E-mail não identificado.');
      navigate('/esquecer-senha');
      return;
    }

    try {
      if (MOCK) {
        // Simulação: gera outro código e salva
        const novo = '654321';
        localStorage.setItem('reset_code', novo);
        setTimeout(() => alert(`Novo código (simulado): ${novo}`), 400);
        return;
      }

      const r = await fetch(`${API_URL}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (r.ok) {
        alert('Código reenviado para seu e-mail.');
      } else {
        const erro = await r.json();
        alert(erro.msg || 'Erro ao reenviar o código.');
      }
    } catch (err) {
      console.error('Erro ao reenviar código:', err);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="tela-token">{/* Reuso do layout/cores da tela de token */}
      <div className="token-container">
        <h2 className="token-titulo">Verificar código</h2>
        <p className="token-subtexto">Enviamos um código para o e-mail: {email || '—'}</p>

        <form onSubmit={handleVerificar}>
          <label htmlFor="codigo">Código de verificação</label>
          <input
            id="codigo"
            type="text"
            placeholder="Digite o código recebido"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />

          <button type="submit" className="btn-verificar" disabled={validando}>
            {validando ? 'Verificando...' : 'Verificar código'}
          </button>
        </form>

        <button className="btn-reenviar" onClick={reenviar}>Reenviar código</button>
      </div>
    </div>
  );
}

export default VerificarCodigo;


