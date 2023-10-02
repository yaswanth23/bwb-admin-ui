import { memo } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SidebarOne from "../../components/sidebar/sidebar-one.component";
import SidebarTwo from "../../components/sidebar/sidebar-two.component";
import SidebarAdmin from "../../components/sidebar/sidebar-admin.component";
import Navbar from "../../components/navbar/navbar.component";
import "./home-page.styles.css";

import { selectUserData } from "../../store/user/user.selector";

const HomePage = () => {
  const userData = useSelector(selectUserData);

  return (
    <>
      <div className="hp-container">
        {userData?.roleId === 100 && <SidebarAdmin />}
        {userData?.roleId === 101 && <SidebarOne />}
        {userData?.roleId === 103 && <SidebarTwo />}
        <div className="hp-content-container">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default memo(HomePage);
