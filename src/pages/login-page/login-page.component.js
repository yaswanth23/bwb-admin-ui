import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  storeUserData,
  changeIsLoggedInUser,
} from "../../store/user/user.action";
import "./login-page.styles.css";

const LoginPage = () => {
  const apiUrl = process.env.REACT_APP_BE_LOGIN_API_URL;
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const handleVerifyLogin = async (event) => {
    event.preventDefault();

    const apiEndpoint = apiUrl;
    const requestData = {
      mobileNumber: mobileNumber,
      password: password,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization:
            "eyJhbGciOiJIUzUxMiJ9.eyJzZWNyZXQiOiJiZmE3MzhhNjdkOGU5NGNmNDI4ZTdjZWE5Y2E1YzY3YiJ9.o4k544e1-NWMTBT28lOmEJe_D4TMOuwb11_rXLWb_SNhd6Oq70lWWqVdHzenEr1mhnVTDAtcOufnc4CMlIxUiw",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(changeIsLoggedInUser());
        dispatch(storeUserData(data.data));
      } else {
        if (data.status === "error") {
          setFormErrorMessage(data.message);
        } else {
          setFormErrorMessage("Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      setFormErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleMobileNumberChange = (event) => {
    const newMobileNumber = +event.target.value;
    if (!isNaN(newMobileNumber)) {
      if (newMobileNumber.toString().length <= 10) {
        setMobileNumber(newMobileNumber.toString());
      }
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Login | BharatWellbeing</title>
        <meta name="description" content="Login | BharatWellbeing" />
      </Helmet>
      <div className="login-page-container">
        <div className="lp-logo-container">
          <Link to="/" className="lp-logo">
            <span className="lp-sub-logo-name">bharat</span>wellbeing
          </Link>
        </div>
        <div className="lp-form-container">
          <div className="lp-form-sub-container">
            <h1 className="lp-form-header">Welcome!</h1>
            <p className="lp-form-sub-text">Login your account</p>
            <form onSubmit={handleVerifyLogin} className="lp-form-main">
              <div className="lp-form-mobile-inp">
                <p className="lp-form-mobile-label">Mobile Number</p>
                <input
                  type="text"
                  required
                  name="mobileNumber"
                  value={mobileNumber == 0 ? "" : mobileNumber}
                  onChange={handleMobileNumberChange}
                  className="lp-form-input-field"
                  placeholder="Enter Mobile Number"
                  autoComplete="off"
                  maxLength="10"
                />
              </div>
              <div className="lp-form-password-inp">
                <p className="lp-form-password-label">Password</p>
                <input
                  type="text"
                  required
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="lp-form-input-field"
                  placeholder="Enter Password"
                  autoComplete="off"
                />
              </div>
              <span className="lp-form-error-message">{formErrorMessage}</span>
              <button type="submit" className="lp-form-submit-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
