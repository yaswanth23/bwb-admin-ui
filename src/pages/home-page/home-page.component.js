import { memo } from "react";
import { Outlet } from "react-router-dom";
import "./home-page.styles.css";

const HomePage = () => {
  return (
    <>
      <div className="hp-container">
        hi there
        {/* <Sidebar />
        <div className="hp-content-container">
          
          <Outlet />
        </div> */}
      </div>
    </>
  );
};

export default memo(HomePage);
