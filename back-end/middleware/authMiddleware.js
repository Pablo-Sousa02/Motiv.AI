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
    console.log('Token decodificado:', decoded); // Debug: veja o que está no token

    // 3. Adiciona os dados decodificados no req
    req.usuario = decoded;

    if (!req.usuario || !req.usuario.id) {
      // Se o token não contém id, rejeite
      return res.status(401).json({ msg: 'Token inválido: usuário não encontrado' });
    }

    next(); // avança para a rota protegida
  } catch (err) {
    console.error('Erro na verificação do token:', err);
    res.status(403).json({ msg: 'Token inválido' });
  }
};

module.exports = authMiddleware;
