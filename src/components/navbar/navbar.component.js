import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import "./navbar.styles.css";

import user_b from "../../assets/icons/user-blue.svg";
import { changeIsLoggedOutUser } from "../../store/user/user.action";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    dispatch(changeIsLoggedOutUser());
  };

  return (
    <>
      <div className="navbar-container">
        <div className="user-icon-container">
          <img
            src={user_b}
            className="user-link-icon"
            alt="user-profile"
            onClick={toggleDropdown}
          />
          {isDropdownVisible && (
            <div className="nv-dropdown-menu">
              <span onClick={handleLogout}>Log out</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Navbar);
