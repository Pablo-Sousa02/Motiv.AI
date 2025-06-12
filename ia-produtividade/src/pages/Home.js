import React from 'react';

export default function Home() {
  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <h1 className="mb-4 text-center" style={{ color: '#101758' }}>
        Bem-vindo ao Motiv.AI!
      </h1>

      <p className="lead text-center mb-5">
        Sua assistente inteligente para aumentar a produtividade e organizar suas tarefas com a ajuda da IA.
      </p>

      <div className="bg-light p-4 rounded shadow-sm mb-5">
        <h2 className="mb-3" style={{ color: '#101758' }}>
          Como o Motiv.AI funciona?
        </h2>
        <ul className="list-unstyled fs-5">
          <li className="mb-3">
            <strong>1. Cadastro e Login:</strong> Crie sua conta para manter suas tarefas seguras.
          </li>
          <li className="mb-3">
            <strong>2. Gerencie suas tarefas:</strong> Adicione, conclua e remova tarefas facilmente. A IA pode ajudar a organizar melhor sua lista.
          </li>
          <li className="mb-3">
            <strong>3. Mensagens Motivacionais:</strong> Receba mensagens personalizadas para manter sua motivação em alta.
          </li>
          <li className="mb-3">
            <strong>4. Chat com IA (em breve):</strong> Converse com a IA para obter ajuda personalizada e otimizar sua produtividade.
          </li>
        </ul>
      </div>

      <p className="text-center text-muted fs-6">
        Comece agora criando sua conta ou fazendo login!
      </p>
    </div>
  );
}