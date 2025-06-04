require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeDatabase } = require('./config/database');


let db; // Variável para armazenar os modelos e a instância do sequelize

const app = express();
const PORT = process.env.PORT || 3000; // É bom usar uma variável para a porta

//Config JSON Response
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Quando usarmos html

//Open Route - Public Route
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo a nossa API!' });
});

// Private Route
app.get('/user/:id', checkToken, async (req, res) => {
  
  const id = req.params.id;  
  const user = await db.User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return res
      .status(404)
      .json({ msg: 'Usuário não encontrado' });
  }

  // Se o usuário for encontrado, retorne-o
  return res.status(200).json({ user });
});

function checkToken(req, res, next) { //função chegar se o token 
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]

  if(!token) {
    return res.status(401).json({msg: 'acesso negado'})
  }

  try {
    const secret = process.env.SECRET

    jwt.verify(token, secret)

    next()
  } catch(error) {
    res.status(400).json({msg: "token inválido"})
  }
}
// Register User
app.post('/auth/register', async (req, res) => {
  const { email, password, confirmpassword } = req.body;

  // validations
  if (!email) {
    return res
      .status(422)
      .json({ msg: 'O email é obrigatório!' });
  }
  if (!password) {
    return res
      .status(422)
      .json({ msg: 'A senha é obrigatória!' });
  }
  if (password !== confirmpassword) {
    return res
      .status(422)
      .json({ msg: 'As senhas não conferem!' });
  }

  try {
    // Movido para englobar a verificação de existência também
    // Check if user exists
    const userExists = await db.User.findOne({
      where: { email: email },
    }); 

    if (userExists) {
      return res
        .status(422)
        .json({ msg: 'Por favor, utilize outro email' });
    }

    // Create password hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user instance (ainda não salvo no DB)
    const user = db.User.build({      
      email,
      password: passwordHash,
    });
     
    // Agora salve a instância no banco de dados
    await user.save(); // user agora contém o ID e outros campos preenchidos pelo DB (como timestamps)    

    return res.status(201).json({msg: 'Usuário criado com sucesso!',

      // Usar os dados da instância salva (user)
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(422).json({msg: 'Este e-mail já está em uso. Por favor, utilize outro.'});
    }
    return res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'});
  }
});

// Login User
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email) {
    return res
      .status(422)
      .json({ msg: 'O email é obrigatório!' });
  }
  if (!password) {
    return res
      .status(422)
      .json({ msg: 'A senha é obrigatória!' });
  }

  // Check if user exists
  const user = await db.User.findOne({ where:{ email: email }});

  if (!user) {
    return res.status(404).json({ msg: 'usuário não encontrado.' });
  }

  // check if password match

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: 'Senha inválida!' });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      {expiresIn: '15m'}
    );

    res
      .status(200)
      .json({
        msg: 'Autenticação validada com sucesso', token});
  } catch (error) {
    console.log(error);

    return res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'});
  }
});

// Função para iniciar o servidor após inicializar o DB
async function startApp() {
  try {
    console.log('Inicializando o banco de dados...');

    // db vai conter { sequelize, User, Client, ... }
    db = await initializeDatabase();
    console.log('Banco de dados inicializado com sucesso.');

    // Iniciar o servidor Express APÓS o DB estar pronto
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(
      'Falha ao inicializar o banco de dados ou iniciar o servidor:',
      error
    );
    process.exit(1); // Encerra a aplicação se o DB não puder ser inicializado
  }
}

// Iniciar a aplicação
startApp();
