import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import axios from "axios";

const STORAGE_KEY = "chatIA_mensagens";

function parseTarefas(texto) {
  // Pega só as linhas que começam com numeração ou traço, ignora o resto
  const linhas = texto.split('\n');
  const tarefas = [];

  for (const linha of linhas) {
    const trim = linha.trim();
    // Regex para linhas que começam com "1.", "2)", "- ", etc
    if (/^(\d+[\.\)]\s+|-)\s*/.test(trim)) {
      // Remove a numeração/traço do início
      const nome = trim.replace(/^(\d+[\.\)]\s+|-)\s*/, '').trim();
      if (nome.length > 0) {
        tarefas.push({ nome });
      }
    }
  }
  return tarefas;
}

function ChatIA({ aoFechar = () => {}, aoReceberTarefas = () => {} }) {
  const [mensagens, setMensagens] = useState(() => {
    const armazenadas = localStorage.getItem(STORAGE_KEY);
    if (armazenadas) {
      try {
        return JSON.parse(armazenadas);
      } catch {
        return [
          {
            role: "assistant",
            content:
              "Olá! Sou a Luma, sua assistente de produtividade. Me diga suas tarefas que organizo para você.",
          },
        ];
      }
    } else {
      return [
        {
          role: "assistant",
          content:
            "Olá! Sou a Luma, sua assistente de produtividade. Me diga suas tarefas que organizo para você.",
        },
      ];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mensagens));
  }, [mensagens]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!input.trim()) return;

    const novaMensagemUsuario = { role: "user", content: input.trim() };
    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/ia/organizar",
        { prompt: input.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const respostaIA = res.data.respostaIA || "";
      const tarefasIAraw = res.data.tarefas || [];

      // Se a API já retornou um array de tarefas válido, usamos ele.
      // Caso contrário, fazemos o parse da resposta textual da IA
      const tarefasIA = Array.isArray(tarefasIAraw) && tarefasIAraw.length > 0
        ? tarefasIAraw
        : parseTarefas(respostaIA);

      // Cria mensagem só com a lista de tarefas para mostrar no chat
      let textoParaChat = "";

      if (tarefasIA.length > 0) {
        textoParaChat = tarefasIA
          .map((tarefa, i) => `${i + 1}. ${tarefa.nome}`)
          .join('\n');
      } else {
        // Caso não tenha conseguido extrair tarefas, mostramos a resposta toda da IA (ou mensagem genérica)
        textoParaChat = respostaIA || "Aqui estão suas tarefas organizadas.";
      }

      // Adiciona a mensagem da IA no chat (apenas a lista limpa)
      setMensagens((prev) => [
        ...prev,
        {
          role: "assistant",
          content: textoParaChat,
        },
      ]);

      // Passa as tarefas puras para o callback (se houver)
      if (tarefasIA.length > 0) {
        aoReceberTarefas(tarefasIA);
      }

    } catch (error) {
      setMensagens((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao processar a mensagem. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const fechar = () => {
    aoFechar();
  };

  return (
    <Card
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: "320px",
        maxHeight: "420px",
        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        backgroundColor: "#fff",
        zIndex: 1050,
      }}
    >
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{ backgroundColor: "#007bff", color: "white", borderRadius: "10px 10px 0 0" }}
      >
        <div>Luma - IA Produtiva</div>
        <Button
          variant="link"
          style={{ color: "white", textDecoration: "none", fontSize: "1.2rem" }}
          onClick={fechar}
          aria-label="Fechar chat"
        >
          <X />
        </Button>
      </Card.Header>

      <Card.Body
        ref={scrollRef}
        style={{
          overflowY: "auto",
          flexGrow: 1,
          padding: "10px",
          fontSize: "0.9rem",
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          whiteSpace: "pre-line",
        }}
      >
        {mensagens.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "10px",
              padding: "8px 12px",
              borderRadius: "15px",
              maxWidth: "85%",
              backgroundColor: msg.role === "assistant" ? "#e9ecef" : "#007bff",
              color: msg.role === "assistant" ? "#212529" : "white",
              alignSelf: msg.role === "assistant" ? "flex-start" : "flex-end",
              wordBreak: "break-word",
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
          </div>
        )}
      </Card.Body>

      <Card.Footer className="p-2">
        <Form.Control
          as="textarea"
          rows={1}
          placeholder="Digite aqui..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ resize: "none", fontSize: "0.9rem" }}
          disabled={loading}
        />
        <Button
          variant="primary"
          onClick={enviarMensagem}
          disabled={loading || !input.trim()}
          className="mt-2 w-100"
        >
          Enviar
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ChatIA;
