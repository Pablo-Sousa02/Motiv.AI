const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota de cadastro
router.post('/register', registerUser);

// Rota de login
router.post('/login', loginUser);
router.get('/perfil', authMiddleware, (req, res) => {
res.json({ msg: `Olá, ${req.usuario.nome}! Seu ID é ${req.usuario.id}` });
});

module.exports = router;
