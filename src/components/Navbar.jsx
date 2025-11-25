import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";


const Navbar = () => {

    const isAdmin = apiService.isAdmin();
    const isAuthenticated = apiService.isAuthenticated();
    const isAuditor = apiService.isAuditor();

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowModal(true)
    }

    const confirmLogout = () => {
        apiService.logout();
        setShowModal(false)
        navigate("/login")
    }

    const cancelLogout = () => {
        setShowModal(false);
    };


    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    MobiBank
                </Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/home" className="navbar-link">Accueil</Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="navbar-item">
                                <Link to="/profile" className="navbar-link">Profile</Link>
                            </li>
                              <li className="navbar-item">
                                        <Link to="/deposit" className="navbar-link">Depôt</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/retrait" className="navbar-link">Retrait</Link>
                            </li>
                             <li className="navbar-item">
                                <Link to="/transfer" className="navbar-link">Transfert</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/transactions" className="navbar-link">Historique Transactions</Link>
                            </li>
                            {(isAdmin || isAuditor) && (
                                <>
                                    <li className="navbar-item">
                                        <Link to="/auditor-dashboard" className="navbar-link">TableauDeBord</Link>
                                    </li>

                                  
                                </>
                            )}
                            <li className="navbar-item">
                                <button
                                    className="navbar-link logout-btn"
                                    onClick={handleLogout}
                                >
                                    Deconnexion
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link"> Connexion </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/register" className="navbar-link">S'inscrire</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <p>Êtes-vous sûr de vouloir vous déconnecter?</p>
                        <div className="modal-actions">
                            <button onClick={confirmLogout} className="btn-confirm">Oui</button>
                            <button onClick={cancelLogout} className="btn-cancel">Non</button>
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
};
export default Navbar;