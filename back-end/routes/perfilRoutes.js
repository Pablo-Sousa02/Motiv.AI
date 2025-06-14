const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Tarefa = require('../models/Tarefa');
const Meta = require('../models/Meta');
const User = require('../models/User');

// 🛡️ Rota protegida que retorna os dados do perfil
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // 👤 Busca o usuário autenticado
    const usuario = await User.findById(usuarioId).select('-senha');

    // 📋 Conta tarefas
    const tarefas = await Tarefa.find({ usuario: usuarioId });
    const tarefasConcluidas = tarefas.filter(t => t.concluida).length;
    const tarefasPendentes = tarefas.length - tarefasConcluidas;

    // 🎯 Conta metas
    const metas = await Meta.find({ usuario: usuarioId });
    const metasConcluidas = metas.filter(m => m.progresso === 100).length;
    const metasEmAndamento = metas.length - metasConcluidas;

    res.json({
      usuario,
      tarefas: { total: tarefas.length, concluidas: tarefasConcluidas, pendentes: tarefasPendentes },
      metas: { total: metas.length, concluidas: metasConcluidas, emAndamento: metasEmAndamento }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao carregar o perfil.' });
  }
});

module.exports = router;
// 📝 Exporta o router para ser usado na aplicação principal