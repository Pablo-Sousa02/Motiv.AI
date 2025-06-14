const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Função para registrar usuário
const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: 'Usuário já cadastrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    const novoUsuario = new User({ nome, email, senha: senhaCriptografada });
    await novoUsuario.save();

    res.status(201).json({ msg: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

// Função de login
const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuário não encontrado' });
    }

    // 2. Compara a senha digitada com a senha criptografada
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ msg: 'Senha incorreta' });
    }

    // 3. Cria um token de autenticação com dados do usuário
    const token = jwt.sign(
      { id: user._id, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token válido por 7 dias
    );

    // 4. Envia o token e dados básicos do usuário como resposta
    res.json({
      token,
      usuario: {
        id: user._id,
        nome: user.nome,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ msg: 'Erro interno no servidor' });
  }
};

module.exports = { registerUser, loginUser };
