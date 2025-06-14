    import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    function MeuPerfil() {
    const [perfil, setPerfil] = useState(null);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const fetchPerfil = async () => {
        try {
            const token = localStorage.getItem('token');
            const resposta = await axios.get('http://localhost:5000/api/perfil', {
            headers: { Authorization: `Bearer ${token}` }
            });
            setPerfil(resposta.data);
        } catch (err) {
            setErro('Erro ao carregar perfil.');
            console.error(err);
        }
        };

        fetchPerfil();
    }, []);

    if (erro) return <p className="text-danger text-center">{erro}</p>;
    if (!perfil) return <p className="text-center">Carregando perfil...</p>;

    const { usuario, tarefas, metas } = perfil;

    return (
        <div className="card shadow p-4 mx-auto mt-4" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4 text-primary text-center">👤 Meu Perfil</h4>

        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>

        <hr />

        <h5 className="text-success mt-3">📋 Tarefas</h5>
        <ul>
            <li>Total: {tarefas.total}</li>
            <li>Concluídas ✅: {tarefas.concluidas}</li>
            <li>Pendentes ⏳: {tarefas.pendentes}</li>
        </ul>

        <h5 className="text-info mt-4">🎯 Metas</h5>
        <ul>
            <li>Total: {metas.total}</li>
            <li>Concluídas ✅: {metas.concluidas}</li>
            <li>Em andamento ⏳: {metas.emAndamento}</li>
        </ul>
        </div>
    );
    }

    export default MeuPerfil;
