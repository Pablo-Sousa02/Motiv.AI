    import React from 'react'; // Importa o React para poder usar JSX e componentes
    import TaskList from '../components/TaskList'; // Importa o componente de tarefas
    import GoalTracker from '../components/GoalTracker'; // Importa o componente de metas

    function Dashboard() {
    return (
        <div className="container mt-5">
        <h2 className="mb-4">Painel de Produtividade</h2>

        <div className="row">
            <div className="col-md-6">
            <TaskList />
            </div>
            <div className="col-md-6">
            <GoalTracker />
            </div>
        </div>
        </div>
    );
    }

    export default Dashboard;
    // Este é o componente principal do Dashboard, que renderiza a lista de tarefas e o rastreador de metas