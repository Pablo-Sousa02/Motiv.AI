const Tarefa = require('../models/Tarefa');

exports.criarTarefa = async (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo) {
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }

  try {
    const novaTarefa = new Tarefa({
      titulo,
      descricao,
      userId: req.userId
    });
    await novaTarefa.save();
    res.status(201).json(novaTarefa);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar tarefa' });
  }
};

exports.listarTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.find({ userId: req.userId });
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar tarefas' });
  }
};
