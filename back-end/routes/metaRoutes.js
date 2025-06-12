const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Meta = require('../models/Meta');

// Criar nova meta
router.post('/', authMiddleware, async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ msg: 'Texto da meta é obrigatório.' });
  }

  try {
    const novaMeta = new Meta({
      texto,
      usuario: req.usuario.id
    });

    const metaSalva = await novaMeta.save();
    res.status(201).json(metaSalva);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao salvar meta.' });
  }
});

// Listar metas do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const metas = await Meta.find({ usuario: req.usuario.id }).sort({ criadoEm: -1 });
    res.json(metas);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar metas.' });
  }
});

// Atualizar progresso da meta
router.patch('/:id/progresso', authMiddleware, async (req, res) => {
  const metaId = req.params.id;

  try {
    const meta = await Meta.findOne({ _id: metaId, usuario: req.usuario.id });

    if (!meta) {
      return res.status(404).json({ msg: 'Meta não encontrada.' });
    }

    if (meta.progresso < 100) {
      meta.progresso += 10;
      if (meta.progresso > 100) meta.progresso = 100;
    }

    await meta.save();
    res.json(meta);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar progresso da meta.' });
  }
});

// Remover meta
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const metaRemovida = await Meta.findOneAndDelete({ _id: req.params.id, usuario: req.usuario.id });

    if (!metaRemovida) {
      return res.status(404).json({ msg: 'Meta não encontrada.' });
    }

    res.json({ msg: 'Meta removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao remover meta.' });
  }
});

module.exports = router;
