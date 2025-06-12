    const express = require('express');
    const router = express.Router();
    const authMiddleware = require('../middleware/authMiddleware');
    const Tarefa = require('../models/Tarefa');

    // ✅ Criar nova tarefa
    router.post('/', authMiddleware, async (req, res) => {
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ msg: 'Nome da tarefa é obrigatório.' });

    try {
        const novaTarefa = new Tarefa({
        nome,
        usuario: req.usuario.id
        });

        const tarefaSalva = await novaTarefa.save();
        res.status(201).json(tarefaSalva);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao salvar tarefa.' });
    }
    });

    // ✅ Listar tarefas do usuário autenticado
    router.get('/', authMiddleware, async (req, res) => {
    try {
        const tarefas = await Tarefa.find({ usuario: req.usuario.id }).sort({ dataCriacao: -1 });
        res.json(tarefas);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar tarefas.' });
    }
    });

    // ✅ Alternar status concluída
    router.patch('/:id/concluir', authMiddleware, async (req, res) => {
    try {
        const tarefaId = req.params.id;
        const usuarioId = req.usuario.id;

        const tarefa = await Tarefa.findOne({ _id: tarefaId, usuario: usuarioId });
        if (!tarefa) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada ou não pertence a este usuário.' });
        }

        tarefa.concluida = !tarefa.concluida;
        await tarefa.save();

        res.json({
        mensagem: 'Status da tarefa atualizado com sucesso.',
        tarefa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar a tarefa.' });
    }
    });

    // ✅ Editar tarefa (nome)
    router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const tarefaId = req.params.id;
        const usuarioId = req.usuario.id;
        const { nome } = req.body;

        if (!nome) {
        return res.status(400).json({ mensagem: 'O nome da tarefa é obrigatório.' });
        }

        const tarefa = await Tarefa.findOne({ _id: tarefaId, usuario: usuarioId });
        if (!tarefa) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada ou não pertence a este usuário.' });
        }

        tarefa.nome = nome;
        await tarefa.save();

        res.json({ mensagem: 'Tarefa atualizada com sucesso.', tarefa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar a tarefa.' });
    }
    });

    // ✅ Remover tarefa
    router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const tarefaId = req.params.id;
        const usuarioId = req.usuario.id;

        const tarefaRemovida = await Tarefa.findOneAndDelete({ _id: tarefaId, usuario: usuarioId });
        if (!tarefaRemovida) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada ou não pertence a este usuário.' });
        }

        res.json({ mensagem: 'Tarefa removida com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao remover a tarefa.' });
    }
    });

    module.exports = router;
