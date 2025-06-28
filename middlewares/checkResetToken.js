const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar o token JWT enviado para a redefinição de senha.
 * Ele garante que o token não só é válido, mas também que foi gerado
 * especificamente para a finalidade de redefinir a senha.
 * * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 * @param {function} next - A função para passar para o próximo middleware.
 */
function checkResetToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token de redefinição não enviado.' });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);

        // **A VERIFICAÇÃO DE SEGURANÇA MAIS IMPORTANTE ESTÁ AQUI**
        // Garante que apenas um token com o "escopo" de reset de senha pode prosseguir.
        if (decoded.scope !== 'reset_password') {
            // Este erro será capturado pelo catch como 'JsonWebTokenError' ou similar,
            // ou você pode criar um tratamento de erro personalizado.
            // Por segurança, retornamos um erro genérico de token inválido.
            return res.status(401).json({ msg: 'Token com permissão inválida para esta operação.' });
        }

        // Anexa o ID do usuário à requisição para ser usado no controller.
        req.id = decoded.id; 
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token de redefinição expirado.' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token de redefinição inválido.' });
        }

        // Mantendo seu padrão de tratamento de erro para casos desconhecidos.
        return res.status(500).json({
            msg: 'Erro desconhecido na verificação de token de redefinição.',
            erro: error.name
        });
    }
}

// CORREÇÃO: Exporta a função diretamente, em vez de um objeto contendo a função.
module.exports = {checkResetToken};
