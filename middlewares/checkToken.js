const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token não enviado.' });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    req.id = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expirado.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ msg: 'Token inválido.' });
    }

    return res.status(500).json({ 
      msg: 'Erro desconhecido na verificação de token.', 
      erro: error.name 
    });
  }
}

module.exports = { checkToken };
