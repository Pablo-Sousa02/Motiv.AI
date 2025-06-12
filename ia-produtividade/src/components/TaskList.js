import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';

function TaskList() {
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const token = localStorage.getItem('token');

  // Referência para o áudio
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tarefas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTarefas(res.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };
    fetchTarefas();
  }, [token]);

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/tarefas',
        { nome: novaTarefa },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTarefas([res.data, ...tarefas]);
      setNovaTarefa('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const removerTarefa = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tarefas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarefas(tarefas.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
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
      setTarefas(tarefas.map((t) => (t._id === id ? tarefaAtualizada : t)));

      // Tocar som quando marcado ou desmarcado
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Minhas Tarefas</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nova tarefa"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()}
        />
        <button className="btn btn-primary" onClick={adicionarTarefa}>
          Adicionar
        </button>
      </div>

      <ul className="list-group">
        {tarefas.length === 0 && (
          <li className="list-group-item text-center text-muted">
            Nenhuma tarefa cadastrada
          </li>
        )}
        {tarefas.map((tarefa) => (
          <li
            key={tarefa._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              tarefa.concluida ? 'bg-success text-white' : ''
            }`}
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
                className="form-check-label"
                htmlFor={`check-${tarefa._id}`}
                style={{
                  cursor: 'pointer',
                  textDecoration: tarefa.concluida ? 'line-through' : 'none',
                  marginLeft: '0.5rem',
                }}
              >
                {tarefa.nome}
              </label>
            </div>

            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={() => removerTarefa(tarefa._id)}
              title="Remover tarefa"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      {/* Áudio para o som de tarefa concluída */}
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/buttons/sounds/button-3.mp3"
        preload="auto"
      />
    </div>
  );
}

export default TaskList;
