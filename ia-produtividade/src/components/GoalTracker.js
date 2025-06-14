import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const token = localStorage.getItem('token');

  // Carrega metas do usuário
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/metas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(res.data);
      } catch (err) {
        console.error('Erro ao buscar metas:', err);
      }
    };
    fetchGoals();
  }, [token]);

  // Adiciona nova meta
  const addGoal = async () => {
    if (goalInput.trim() === '') return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/metas',
        { texto: goalInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([res.data, ...goals]);
      setGoalInput('');
    } catch (err) {
      console.error('Erro ao adicionar meta:', err);
    }
  };

  // Incrementa progresso
  const incrementProgress = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/metas/${id}/progresso`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const atualizadas = goals.map((g) => (g._id === id ? res.data : g));
      setGoals(atualizadas);
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    }
  };

  // Remove meta
  const removeGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/metas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(goals.filter((g) => g._id !== id));
    } catch (err) {
      console.error('Erro ao remover meta:', err);
    }
  };

  return (
    <div className="card shadow-lg mb-5 mx-auto" style={{ maxWidth: '600px' }}>
      <div className="card-body">
        <h5 className="card-title text-primary mb-4 text-center">🎯 Minhas Metas</h5>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Ex: Estudar 30 minutos"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          />
          <button className="btn btn-success" onClick={addGoal}>
            <i className="bi bi-plus-lg me-2"></i> Adicionar
          </button>
        </div>

        {goals.length === 0 && (
          <p className="text-muted text-center fst-italic">Nenhuma meta adicionada ainda.</p>
        )}

        {goals.map((goal) => (
          <div key={goal._id} className="mb-4 p-3 border rounded bg-light shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong className="text-truncate" style={{ maxWidth: '70%' }}>
                {goal.texto}
              </strong>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => incrementProgress(goal._id)}
                  disabled={goal.progresso >= 100}
                  title="Incrementar 10%"
                >
                  <i className="bi bi-arrow-up-circle-fill me-1"></i> +10%
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeGoal(goal._id)}
                  title="Remover meta"
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>

            <div className="progress" style={{ height: '24px', borderRadius: '12px' }}>
              <div
                className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${goal.progresso}%`, borderRadius: '12px' }}
                aria-valuenow={goal.progresso}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {goal.progresso}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalTracker;
