const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar o token JWT de login do usuário.
 * Anexa o ID do usuário à requisição se o token for válido.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 * @param {function} next - A função para passar para o próximo middleware.
 */
function checkLoginToken(req, res, next) {

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

module.exports = { checkLoginToken };
