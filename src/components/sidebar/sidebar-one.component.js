import { Fragment, memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar-one.styles.css";

import budget_b from "../../assets/icons/budget-blue.svg";
import budget_w from "../../assets/icons/budget-white.svg";
import home_b from "../../assets/icons/home-blue.svg";
import home_w from "../../assets/icons/home-white.svg";

const SidebarOne = () => {
  const location = useLocation();
  const [activeLinkIdx, setActiveLinkIdx] = useState(1);

  useEffect(() => {
    if (location.pathname === "/all-bookings") {
      setActiveLinkIdx(2);
    }

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
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default memo(SidebarOne);
