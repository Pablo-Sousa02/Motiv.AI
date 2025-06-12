import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Offcanvas, Modal as BootstrapModal } from 'bootstrap';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const offcanvasRef = useRef(null);

  // Referência para o modal Bootstrap
  const modalRef = useRef(null);
  const bsModalInstance = useRef(null);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Fecha offcanvas ao mudar rota
    if (offcanvasRef.current) {
      const instance = Offcanvas.getInstance(offcanvasRef.current) || new Offcanvas(offcanvasRef.current);
      instance.hide();
    }
    // Atualiza estado login
    const token = localStorage.getItem('token');
    setIsLogged(!!token);

    // Inicializa o modal Bootstrap (uma vez)
    if (modalRef.current && !bsModalInstance.current) {
      bsModalInstance.current = new BootstrapModal(modalRef.current, {
        backdrop: 'static',
        keyboard: false,
        focus: true,
      });
    }
  }, [location]);

  const openModal = () => {
    if (bsModalInstance.current) bsModalInstance.current.show();
    
  };

  const closeModal = () => {
    if (bsModalInstance.current) bsModalInstance.current.hide();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    closeModal();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">Motiv.AI</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            ref={offcanvasRef}
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link className="nav-link" to="/">🏠 Início</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tarefas">📝 Tarefas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/metas">🎯 Metas</Link>
                </li>

                {!isLogged && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">🔐 Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cadastro">🧾 Cadastro</Link>
                    </li>
                  </>
                )}

                {isLogged && (
                  <li className="nav-item d-flex align-items-center">
                    <button
                        onClick={openModal}
                        className="btn btn-link nav-link"
                        style={{ cursor: 'pointer' }}
                        title="Perfil"
                        >
                        <i className="bi bi-person-circle fs-2" style={{ color: 'gray' }}></i>
                        </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Bootstrap */}
      <div
        className="modal fade"
        id="profileModal"
        tabIndex="-1"
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="profileModalLabel">Perfil</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Você está logado.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={handleLogout}>
                Sair
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
