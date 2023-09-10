import { memo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar.component";
import Navbar from "../../components/navbar/navbar.component";
import "./home-page.styles.css";

const HomePage = () => {
  return (
    <>
      <div className="hp-container">
        <Sidebar />
        <div className="hp-content-container">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default memo(HomePage);
