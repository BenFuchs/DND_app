import React from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sheetID } = useParams();

    // Logout function
    const logout = () => {
        localStorage.removeItem('Token'); // Clear the token from local storage
        navigate('/'); // Redirect to the home page
    };

    // Determine the page and display relevant buttons
    const renderButtons = () => {
        switch (location.pathname) {
            // case '/sheets':
            //     // return <Link to="/" className="btn btn-secondary me-2">Home</Link>;
                
                
            case `/game/${sheetID}`:
                return (
                    <>
                        <Link to="/sheets" className="btn btn-secondary me-2">Sheets</Link>
                        <Link to={`/game/${sheetID}/inventory`} className="btn btn-secondary me-2">Inventory</Link>
                        <Link to={`/game/${sheetID}/traits`} className="btn btn-secondary me-2">Traits</Link>
                        <Link to="/chat" className='btn btn-secondary'>Chat</Link>  
                    </>
                );
            case `/game/${sheetID}/inventory`:
                return (
                    <>
                    <Link to="/sheets" className="btn btn-secondary me-2">Sheets</Link>
                    <Link to={`/game/${sheetID}`} className="btn btn-secondary me-2">Main Sheet</Link>
                    <Link to={`/game/${sheetID}/traits`} className="btn btn-secondary me-2">Traits</Link>
                    <Link to="/chat" className='btn btn-secondary'>Chat</Link>  
                    </>
                )
            case `/game/${sheetID}/traits`:
                return (
                    <>
                    <Link to="/sheets" className="btn btn-secondary me-2">Sheets</Link>
                    <Link to={`/game/${sheetID}`} className="btn btn-secondary me-2">Main Sheet</Link>
                    <Link to={`/game/${sheetID}/inventory`} className="btn btn-secondary me-2">Inventory</Link>
                    <Link to="/chat" className='btn btn-secondary'>Chat</Link>  
                    </>
                )
            case '/chat':
                return (
                    <>
                    <Link to="/sheets" className="btn btn-secondary me-2">Sheets</Link>
                    <Link to={`/game/${sheetID}`} className="btn btn-secondary me-2">Main Sheet</Link>
                    <Link to={`/game/${sheetID}/inventory`} className="btn btn-secondary me-2">Inventory</Link>
                    <Link to={`/game/${sheetID}/traits`} className="btn btn-secondary me-2">Traits</Link>
                    </>
                )
            default:
                return 
                    // <>
                    // <Link to="/" className="btn btn-secondary">Home</Link>
                    // </>
                
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">MyApp</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                        </ul>
                        <span className="navbar-text">
                            {/* Render buttons according to the current page */}
                            {renderButtons()}
                        </span>
                        <button onClick={logout} className="btn btn-danger ms-2">Logout</button> {/* Always visible logout button */}
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Outlet /> {/* Render the child route component here */}
            </div>
        </div>
    );
};

export default Layout;
