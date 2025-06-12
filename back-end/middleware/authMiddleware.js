const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se veio o token no header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Adiciona os dados decodificados no req
    req.usuario = decoded;

    next(); // avança para a rota protegida
  } catch (err) {
    res.status(403).json({ msg: 'Token inválido' });
  }
};

module.exports = authMiddleware;
