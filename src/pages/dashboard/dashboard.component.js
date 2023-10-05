import { memo, useEffect, useState } from "react";
import { FaUserDoctor, FaRegHandshake } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import "./dashboard.styles.css";

const Dashboard = () => {
  const apiUrl = process.env.REACT_APP_BE_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const [usersCount, setUsersCount] = useState({});

  console.log(usersCount);

  useEffect(() => {
    fetchUsersCount();
  }, []);

  const fetchUsersCount = () => {
    const apiEndpoint = apiUrl + "/admin/users/count";
    fetch(apiEndpoint, {
      method: "GET",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUsersCount(data.data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-total-users-container">
          <div className="dashboard-users-box">
            <GiMedicines className="medicines-icon" />
            <h3>Pharmacists</h3>
            <p>{usersCount.pharmacyUsersCount}</p>
          </div>
          <div className="dashboard-users-box">
            <FaUserDoctor className="doctor-icon" />
            <h3>Doctors</h3>
            <p>{usersCount.doctorUsersCount}</p>
          </div>
          <div className="dashboard-users-box">
          <FaRegHandshake className="partner-icon" />
            <h3>Partners</h3>
            <p>{usersCount.partnerUsersCount}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Dashboard);
