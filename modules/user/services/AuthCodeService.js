/**
 * AuthCodeService.js
 *
 * Este serviço gerencia o ciclo de vida completo dos códigos de autenticação de
 * dois fatores (2FA). A verificação e a concessão de tokens são combinadas em
 * um único passo para garantir a segurança do fluxo.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Usando bcryptjs para compatibilidade
const sendEmail = require('../../../utils/SendEmail');
const EmailService = new sendEmail();

class AuthCodeService {

    constructor(AuthCodeRepository, UserRepository) {
        this.AuthCodeRepository = AuthCodeRepository;
        this.UserRepository = UserRepository;
    }

    /**
     * Gera e envia um novo código de verificação para o usuário.
     * Esta função é o primeiro passo do fluxo 2FA.
     * @param {object} data - Contém userId, email e type ('login_verification', 'password_reset', etc.).
     */
    async sendCode({ email, type }) {
        try {
            // 1. Valida se o usuário e o e-mail correspondem no banco de dados.
            const user = await this.UserRepository.findByEmail(email);
            if (!user || user.email !== email) {
                throw new Error('ID_EMAIL_INCOMPATIVEIS');
            }

            const userId = user.id;

            const existingCode = await this.AuthCodeRepository.findByUserId({ userId });
            const now = new Date();
            let currentAttempts = 0; // Inicia o contador de tentativas como 0 para uma nova sessão.

            if (existingCode) {
                // 2a. Verifica se o usuário ainda está sob um bloqueio ativo.
                if (existingCode.blockedUntil && new Date(existingCode.blockedUntil) > now) {
                    const remainingMinutes = Math.ceil((new Date(existingCode.blockedUntil) - now) / 60000);
                    throw new Error(`BLOQUEIO_TEMPORARIO: Muitas tentativas. Tente novamente em ${remainingMinutes} minutos.`);
                }

                // 2b. CORREÇÃO DE SEGURANÇA: Decide se as tentativas devem ser zeradas.
                const isBlockExpired = existingCode.blockedUntil && new Date(existingCode.blockedUntil) <= now;
                const isAttemptStale = (now.getTime() - new Date(existingCode.createdAt).getTime()) > (10 * 60 * 1000); // Limite de 10 minutos

                if (isBlockExpired || isAttemptStale) {
                    // Se o bloqueio expirou ou a última tentativa foi há muito tempo,
                    // considera-se uma nova sessão de autenticação. As tentativas são zeradas.
                    currentAttempts = 0;
                } else {
                    // Se a tentativa for recente e não houve bloqueio, preserva o contador.
                    currentAttempts = existingCode.attempts || 0;
                }
                
                // 2c. Lógica de cooldown para prevenir spam de e-mails.
                const timeSinceCreation = now.getTime() - new Date(existingCode.createdAt).getTime();
                const cooldownSeconds = 30;
                if (timeSinceCreation < cooldownSeconds * 1000) {
                    const remainingSeconds = Math.ceil((cooldownSeconds * 1000 - timeSinceCreation) / 1000);
                    throw new Error(`COOLDOWN: Aguarde ${remainingSeconds} segundos para solicitar um novo código.`);
                }
            }

            // 3. Remove qualquer código antigo antes de criar um novo.
            if (existingCode) {
                await this.AuthCodeRepository.delete({ userId });
            }

            // 4. Gera um novo código numérico de 6 dígitos.
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();

            // 5. Cria o novo registro do código, usando o contador de tentativas (zerado ou preservado).
            await this.AuthCodeRepository.create({
                userId,
                twoFactorCode,
                type,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expira em 5 minutos
                attempts: currentAttempts,
                blockedUntil: null, 
                createdAt: new Date()
            });

            // 6. Prepara e envia o e-mail com o código.
            const title = 'Seu Código de Verificação BANKUP';
            const content = `
                <p>Prezado usuário do BANKUP,</p>
                <p>Recebemos uma solicitação para sua conta. Seu código de verificação é:</p>
                <h1 style="font-size: 28px; letter-spacing: 2px; color: #1a1a1a;">${twoFactorCode}</h1>
                <p>Este código expira em 5 minutos.</p>
                <br>
                <p>Se você não solicitou este código, ignore este e-mail. <strong>Não encaminhe ou dê o código a ninguém.</strong></p>
                <p>Atenciosamente,</p>
                <p>Equipe BANKUP</p>
            `;

            await EmailService.sendEmail(email, title, content);

            return { userId, message: "Código enviado com sucesso." };

        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('AuthCodeService.sendCode ERRO:', err);
            }
            throw err;
        }
    }

    /**
     * Verifica o código e, se for válido, gera o token apropriado (Login ou Reset).
     * @param {object} data - Contém userId e twoFactorCode.
     * @returns {Promise<{token?: string, resetToken?: string}>} Retorna o token gerado.
     */
    async verifyCodeAndGetToken({ userId, twoFactorCode }) {
        try {
            const authCode = await this.AuthCodeRepository.findByUserId({ userId });

            if (!authCode) {
                throw new Error('CODIGO_INVALIDO');
            }

            const now = new Date();

            if (authCode.blockedUntil && new Date(authCode.blockedUntil) > now) {
                throw new Error('BLOQUEIO_TEMPORARIO');
            }

            if (new Date(authCode.expiresAt) < now) {
                await this.AuthCodeRepository.delete({ userId });
                throw new Error('CODIGO_EXPIRADO');
            }

            if (authCode.twoFactorCode !== twoFactorCode) {
                const newAttempts = (authCode.attempts || 0) + 1;
                const MAX_ATTEMPTS = 3;

                if (newAttempts >= MAX_ATTEMPTS) {
                    await this.AuthCodeRepository.update({ userId }, {
                        attempts: newAttempts,
                        blockedUntil: new Date(Date.now() + 10 * 60 * 1000)
                    });
                    throw new Error('CODIGO_INVALIDO_BLOQUEIO');
                } else {
                    await this.AuthCodeRepository.update({ userId }, { attempts: newAttempts });
                }

                throw new Error('CODIGO_INVALIDO');
            }

            const user = await this.UserRepository.getById(userId);
            if (!user) {
                // Sanity check: se o código era válido, o usuário deve existir.
                throw new Error('USUARIO_NAO_ENCONTRADO_APOS_VERIFICACAO');
            }
            
            await this.AuthCodeRepository.delete({ userId });

            if (!process.env.SECRET) {
                throw new Error('JWT_SECRET_NAO_DEFINIDO');
            }

            switch (authCode.type) {
                case 'login_verification':{
                    const token = jwt.sign({ id: userId }, process.env.SECRET, {
                        expiresIn: '1d',
                    });
                    return { token, profile_complete: user.profile_complete }
                }
                
                case 'password_reset':{
                    const resetToken = jwt.sign({ id: userId, scope: 'reset_password' }, process.env.SECRET);
                    return { resetToken }
                }

                default:
                    throw new Error('TIPO_DE_CODIGO_INVALIDO');
            }

        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('AuthCodeService.verifyCodeAndGetToken ERRO:', err);
            }
            throw err;
        }
    }

    /**
     * Atualiza a senha do usuário no banco de dados.
     * @param {object} data - Contém o userId (extraído do token) e a newPassword.
     * @returns {Promise<{message: string}>} Mensagem de sucesso.
     */
    async passwordReset({ userId, newPassword }) {
        try {
            if (!userId || !newPassword) {
                throw new Error('DADOS_INSUFICIENTES');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            
            await this.UserRepository.update(userId, { password: hashedPassword });
            

            return { message: "Senha atualizada com sucesso." };
            
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('AuthCodeService.passwordReset ERRO:', err);
            }
            throw err;
        }
    }
}

module.exports = AuthCodeService;
