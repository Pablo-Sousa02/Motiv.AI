const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true
  },
  progresso: {
    type: Number,
    default: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meta', metaSchema);
