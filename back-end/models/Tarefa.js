const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  concluida: { type: Boolean, default: false },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tarefa', tarefaSchema);
