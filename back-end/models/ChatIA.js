    const mongoose = require("mongoose");

    const MensagemSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["system", "user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    });

    const ChatIASchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        unique: true, // 1 chat por usuário
    },
    mensagens: [MensagemSchema],
    });

    module.exports = mongoose.model("ChatIA", ChatIASchema);
