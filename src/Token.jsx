import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/token.css';

function Token() {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Usuário não identificado. Faça login novamente.');
      navigate('/login');
      return;
    }

    try {
      const resposta = await fetch('http://100.108.7.70:3000/user/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          twoFactorCode: codigo,
        }),
      });

      if (resposta.ok) {
        const data = await resposta.json();
        const token = data.token;

        // Salva o token
        localStorage.setItem('token', token);

        alert('Código verificado com sucesso!');
        navigate('/cadAdicional'); // redireciona para a próxima etapa
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Código inválido.');
      }
    } catch (err) {
      console.error('Erro ao verificar código:', err);
      alert('Erro de conexão com o servidor.');
    }
  };

  // Função para reenviar código
  const reenviarCodigo = async () => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');

    if (!userId || !email) {
      alert('Usuário não identificado. Faça login novamente.');
      navigate('/login');
      return;
    }

    try {
      const resposta = await fetch('http://100.108.7.70:3000/user/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          type: 'login_verification',
        }),
      });

      if (resposta.ok) {
        alert('Código reenviado para seu e-mail.');
      } else {
        const erro = await resposta.json();
        alert(erro.msg || 'Erro ao reenviar código.');
      }
    } catch (err) {
      console.error('Erro ao reenviar código:', err);
      alert('Erro de conexão com o servidor.');
    }
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
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit" className="btn-verificar">Verificar</button>
        </form>

        <button onClick={reenviarCodigo} className="btn-reenviar">
          Reenviar código
        </button>
      </div>
    </div>
  );
}

export default Token;