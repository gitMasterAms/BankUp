
const express = require('express');

const router = express.Router();

//Open Route - Public Route
router.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo a nossa API!' });
});

// Private Route
app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id;
  // 2. Usar db.User para acessar o modelo
  // 3. Usar findByPk para buscar pela chave primária (ID)
  // 4. Usar a opção 'attributes: { exclude: ['password'] }' para não retornar a senha
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

