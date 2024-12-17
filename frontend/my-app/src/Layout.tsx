import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sheetID } = useParams();
  const { roomName } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Logout function
  const logout = () => {
    localStorage.removeItem("Token"); // Clear the token from local storage
    navigate("/"); // Redirect to the home page
  };

  // Determine the page and display relevant buttons
  const renderButtons = () => {
    switch (location.pathname) {
      case "/sheets":
        return (
          <>
            <Link
              to="/orders"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Extra Sheets!
            </Link>
          </>
        );

      case `/game/${sheetID}`:
        return (
          <>
            <Link
              to="/sheets"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Sheets
            </Link>
            <Link
              to={`/game/${sheetID}/inventory`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Inventory
            </Link>
            <Link
              to={`/game/${sheetID}/traits`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Traits
            </Link>
            <Link
              to={`/game/${sheetID}/chat`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Chat
            </Link>
          </>
        );
      case `/game/${sheetID}/inventory`:
        return (
          <>
            <Link
              to="/sheets"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Sheets
            </Link>
            <Link
              to={`/game/${sheetID}`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Main Sheet
            </Link>
            <Link
              to={`/game/${sheetID}/traits`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Traits
            </Link>
            <Link
              to={`/game/${sheetID}/chat`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Chat
            </Link>
          </>
        );
      case `/game/${sheetID}/traits`:
        return (
          <>
            <Link
              to="/sheets"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Sheets
            </Link>
            <Link
              to={`/game/${sheetID}`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Main Sheet
            </Link>
            <Link
              to={`/game/${sheetID}/inventory`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Inventory
            </Link>
            <Link
              to={`/game/${sheetID}/chat`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Chat
            </Link>
          </>
        );
      case `/game/${sheetID}/chat`:
        return (
          <>
            <Link
              to="/sheets"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Sheets
            </Link>
            <Link
              to={`/game/${sheetID}`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Main Sheet
            </Link>
            <Link
              to={`/game/${sheetID}/inventory`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Inventory
            </Link>
            <Link
              to={`/game/${sheetID}/traits`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Traits
            </Link>
          </>
        );
      case "/orders":
        return (
          <>
            <Link
              to="/sheets"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Sheets
            </Link>
          </>
        );
      case `/game/${sheetID}/chat/${roomName}/`:
        return (
          <>
            <Link
              to="/sheets"
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Sheets
            </Link>
            <Link
              to={`/game/${sheetID}`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Main Sheet
            </Link>
            <Link
              to={`/game/${sheetID}/inventory`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Inventory
            </Link>
            <Link
              to={`/game/${sheetID}/traits`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Traits
            </Link>
            <Link
              to={`/game/${sheetID}/chat`}
              className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} `}
            >
              Chat
            </Link>
          </>
        );
      default:
        return;
    }
  };

  useEffect(() => {
    darkModeSwitch();
  }, [isDarkMode]);

  const darkModeSwitch = () => {
    const element = document.body;
    if (isDarkMode) {
      element.classList.add("dark-mode");
      element.classList.remove("light-mode");
      console.log(element.classList); // To check if the classes are toggled correctly
    } else {
      element.classList.add("light-mode");
      element.classList.remove("dark-mode");
      console.log(element.classList); // To check if the classes are toggled correctly

    }
  };

  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg ${
          isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
      >
        <div className="container-fluid">
          <Link
            className="navbar-brand disabled-link"
            to="/"
            onClick={(e) => e.preventDefault()} // Prevent default navigation
            style={{
              pointerEvents: "none", // Prevents interaction
              color: isDarkMode ? "rgb(187, 187, 187)" : "rgb(46, 44, 44)",
              cursor: "not-allowed", // Indicate it's disabled
            }}
          >
            MyApp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                  style={{
                    color: isDarkMode
                      ? "rgb(187, 187, 187)"
                      : "rgb(46, 44, 44)",
                  }}
                >
                  Home
                </Link>
              </li>
              {/* You can add other nav items here if needed */}
            </ul>
            <div className="d-flex align-items-center" style={{ gap: "3px" }}>
              {renderButtons()}
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`btn ${isDarkMode ? "btn-light" : "btn-dark"}`}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;