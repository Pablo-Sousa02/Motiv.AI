    import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';

    function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        setErro('');
        setMensagem('');

        try {
        const response = await fetch('http://localhost:5000/api/users/login', { // ajuste a URL conforme seu back
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // salva o token
            setMensagem('Login efetuado com sucesso! Redirecionando...');
            setTimeout(() => {
            navigate('/tarefas'); // redireciona para tarefas
            }, 1500);
        } else {
            setErro(data.msg || 'Erro no login.');
        }
        } catch (error) {
        setErro('Erro na conexão com o servidor.');
        }
    };

    return (
        <div className="container mt-5">
        <div className="text-center mb-4">
            <h1 className="fw-bold">Motiv.AI</h1>
            <p className="text-muted">Sua assistente virtual para produtividade, foco e motivação diária.</p>
        </div>

        <div className="card mx-auto" style={{ maxWidth: '400px' }}>
            <div className="card-body">
            <h4 className="card-title text-center mb-3">Entrar</h4>

            {mensagem && <div className="alert alert-success">{mensagem}</div>}
            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleLogin}>
                <div className="mb-3">
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="mb-3">
                <label>Senha</label>
                <input
                    type="password"
                    className="form-control"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                Entrar
                </button>
            </form>

            <div className="text-center mt-3">
                <span>Ainda não tem conta? </span>
                <Link to="/cadastro">Cadastrar-se</Link>
            </div>
            </div>
        </div>
        </div>
    );
    }

    export default LoginPage;
