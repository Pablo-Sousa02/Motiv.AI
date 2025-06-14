import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ChatIA from "./ChatIA";

function TaskList() {
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [mostrarChat, setMostrarChat] = useState(false);
  const token = localStorage.getItem("token");
  const audioRef = useRef(null);

  // Memoizar atualizarTarefas para evitar warning no useEffect
  const atualizarTarefas = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tarefas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarefas(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      atualizarTarefas();
    }
  }, [token, atualizarTarefas]);

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tarefas",
        { nome: novaTarefa },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTarefas([res.data, ...tarefas]);
      setNovaTarefa("");
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const adicionarTarefasIA = async (tarefasIA) => {
    try {
      const respostas = await Promise.all(
        tarefasIA.map((tarefa) =>
          axios.post(
            "http://localhost:5000/api/tarefas",
            { nome: tarefa.nome },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      const novasTarefas = respostas.map((res) => res.data);
      setTarefas((prev) => [...novasTarefas, ...prev]);
    } catch (error) {
      console.error("Erro ao salvar tarefas da IA:", error);
    }
  };

  const removerTarefa = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tarefas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarefas((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Erro ao remover tarefa:", error);
    }
  };

  const toggleConcluida = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/tarefas/${id}/concluir`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const tarefaAtualizada = res.data.tarefa;
      setTarefas((prev) =>
        prev.map((t) => (t._id === id ? tarefaAtualizada : t))
      );

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary fw-bold">📋 Minhas Tarefas</h2>

      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => setMostrarChat(true)}
      >
        💬 Organizar com IA
      </button>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Nova tarefa"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
        />
        <button className="btn btn-primary" onClick={adicionarTarefa}>
          Adicionar
        </button>
      </div>

      <ul className="list-group shadow-sm">
        {tarefas.length === 0 && (
          <li className="list-group-item text-center text-muted">
            Nenhuma tarefa cadastrada
          </li>
        )}

        {tarefas.map((tarefa) => (
          <li
            key={tarefa._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              tarefa.concluida ? "list-group-item-success" : ""
            }`}
            style={{
              borderRadius: "8px",
              marginBottom: "8px",
              transition: "background-color 0.3s ease",
            }}
          >
            <div className="form-check" style={{ flexGrow: 1 }}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={tarefa.concluida}
                onChange={() => toggleConcluida(tarefa._id)}
                id={`check-${tarefa._id}`}
              />
              <label
                className={`form-check-label ms-2 ${
                  tarefa.concluida
                    ? "text-decoration-line-through text-muted"
                    : ""
                }`}
                htmlFor={`check-${tarefa._id}`}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {tarefa.nome}
              </label>
            </div>

            <button
              className="btn btn-danger btn-sm ms-3"
              onClick={() => removerTarefa(tarefa._id)}
              title={`Remover tarefa ${tarefa.nome}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <audio
        ref={audioRef}
        src="https://www.soundjay.com/buttons/sounds/button-3.mp3"
        preload="auto"
      />

      {mostrarChat && (
        <ChatIA
          aoFechar={() => setMostrarChat(false)}
          aoReceberTarefas={adicionarTarefasIA}
        />
      )}
    </div>
  );
}

export default TaskList;
