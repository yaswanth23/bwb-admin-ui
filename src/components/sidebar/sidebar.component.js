import { Fragment, memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.styles.css";

import budget_b from "../../assets/icons/budget-blue.svg";
import budget_w from "../../assets/icons/budget-white.svg";
import home_b from "../../assets/icons/home-blue.svg";
import home_w from "../../assets/icons/home-white.svg";
// import plane_b from "../../assets/icons/plane-blue.svg";
// import plane_w from "../../assets/icons/plane-white.svg";

const Sidebar = () => {
  const location = useLocation();
  const [activeLinkIdx, setActiveLinkIdx] = useState(1);

  useEffect(() => {
    if (location.pathname === "/all-bookings") {
      setActiveLinkIdx(2);
    }
    //  else if (location.pathname === "/my-bookings") {
    //   setActiveLinkIdx(3);
    // }
    document.body.style.backgroundColor = "#f2f2f2";
    return () => {
      document.body.style.backgroundColor = "#f2f2f2";
    };
  }, [location.pathname]);

  return (
    <Fragment>
      <div className="sb-container">
        <div className="sb-logo-container">
          <Link to="/" className="sb-logo">
            <span className="sb-sub-logo-name">bharat</span>wellbeing
          </Link>
        </div>
        <nav className="sb-navigation">
          <ul className="sb-nav-list">
            <li className="sb-nav-item">
              <Link
                to="/"
                onClick={() => setActiveLinkIdx(1)}
                className={`sb-nav-link ${
                  1 === activeLinkIdx ? "active" : null
                }`}
              >
                <img
                  src={1 === activeLinkIdx ? home_b : home_w}
                  className="sb-nav-link-icon"
                  alt="home-icon"
                />
                <span className="sb-nav-link-text">Home</span>
              </Link>
            </li>
            <li className="sb-nav-item">
              <Link
                to="/all-bookings"
                onClick={() => setActiveLinkIdx(2)}
                className={`sb-nav-link ${
                  2 === activeLinkIdx ? "active" : null
                }`}
              >
                <img
                  src={2 === activeLinkIdx ? budget_b : budget_w}
                  className="sb-nav-link-icon"
                  alt="book-diagnostics-icon"
                />
                <span className="sb-nav-link-text">All Bookings</span>
              </Link>
            </li>
            {/* <li className="sb-nav-item">
              <Link
                to="/my-bookings"
                onClick={() => setActiveLinkIdx(3)}
                className={`sb-nav-link ${
                  3 === activeLinkIdx ? "active" : null
                }`}
              >
                <img
                  src={3 === activeLinkIdx ? plane_b : plane_w}
                  className="sb-nav-link-icon"
                  alt="transactions-icon"
                />
                <span className="sb-nav-link-text">My Bookings</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default memo(Sidebar);
