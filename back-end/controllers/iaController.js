const { OpenAI } = require("openai");
const Tarefa = require("../models/Tarefa");
const ChatIA = require("../models/ChatIA");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ROLES_VALIDOS = ["system", "user", "assistant"];

const organizarIA = async (req, res) => {
  const { prompt } = req.body;
  const usuario = req.usuario.id;

  try {
    // Define a personalidade e instruções para a IA
    const mensagens = [
      {
        role: "system",
        content: `
          Você é a Luma, uma assistente simpática e produtiva que ajuda o usuário a organizar suas tarefas.

          Responda sempre de forma educada, amigável e motivacional.

          Somente quando o usuário pedir explicitamente palavras como "organizar", "adicionar tarefas", "listar tarefas" ou "criar lista", responda com uma lista numerada clara e organizada no formato exato:

          Aqui estão suas tarefas:
          1. [Tarefa 1]
          2. [Tarefa 2]
          3. [Tarefa 3]

          Se o usuário conversar normalmente, responda com mensagens naturais, motivacionais e sem listas ou organização.

          Nunca inclua a frase "Aqui estão suas tarefas:" ou listas numeradas se o usuário não pedir explicitamente.

          Sempre mantenha um tom simpático e encorajador.
        `,
      },
    ];

    // Recupera o histórico de mensagens do usuário (se houver)
    const historico = await ChatIA.findOne({ usuario });
    if (historico) {
      historico.mensagens.forEach((m) => {
        if (ROLES_VALIDOS.includes(m.role)) {
          mensagens.push({ role: m.role, content: m.content });
        } else {
          console.warn(`Ignorando mensagem com role inválido: ${m.role}`);
        }
      });
    }

    // Adiciona o prompt atual do usuário
    mensagens.push({ role: "user", content: prompt });

    // Envia a conversa para a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: mensagens,
    });

    const respostaIA = completion.choices[0].message.content;

    // Salva o chat no banco (atualiza ou cria novo documento)
    await ChatIA.findOneAndUpdate(
      { usuario },
      {
        $push: {
          mensagens: [
            { role: "user", content: prompt },
            { role: "assistant", content: respostaIA },
          ],
        },
      },
      { upsert: true, new: true }
    );

    // Regex para capturar lista numerada após "Aqui estão suas tarefas:"
    const regexLista = /aqui estão suas tarefas:\s*([\s\S]*)/i;
const match = respostaIA.match(regexLista);

let tarefasSalvas = [];

if (match && match[1]) {
  // Quebra em linhas
  const linhas = match[1].split("\n");

  // Filtra somente as linhas que começam com número + ponto ou parêntese
  const tarefas = linhas
    .filter((linha) => /^\s*\d+[\.\)]\s*/.test(linha)) // só linhas com número e separador
    .map((linha) => linha.replace(/^\s*\d+[\.\)]\s*/, "").trim()) // remove número e espaço
    .filter((descricao) => descricao.length > 0); // remove linhas vazias

  tarefasSalvas = await Promise.all(
    tarefas.map(async (descricao) => {
      return await Tarefa.create({ nome: descricao, usuario });
    })
  );
}

    // Retorna a resposta da IA e as tarefas salvas no JSON
    return res.status(200).json({
      sucesso: true,
      respostaIA,
      tarefas: tarefasSalvas,
    });
  } catch (error) {
    console.error("Erro na IA:", error.message);
    return res.status(500).json({ erro: "Erro ao processar com a Luma." });
  }
};

module.exports = { organizarIA };
