import { memo, useState, useEffect } from "react";
import { DateTime } from "luxon";
import { BsFillClockFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import "./my-appointments.styles.css";

import { selectUserData } from "../../store/user/user.selector";

const MyAppointmentsPage = () => {
  const apiUrl = process.env.REACT_APP_BE_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const userData = useSelector(selectUserData);
  const [limit, setLimit] = useState(10);
  const [allAppointments, setAllAppointments] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  console.log(allAppointments);

  const startBookingIndex = (pageNumber - 1) * limit + 1;
  const endBookingIndex =
    allAppointments.length > 0
      ? Math.min(startBookingIndex + limit - 1, metaData.totalAppointmentCount)
      : 0;

  useEffect(() => {
    fetchAllAppointments();
  }, [pageNumber]);

  const fetchAllAppointments = () => {
    const apiEndpoint =
      apiUrl +
      `/get/all_appointments?userId=${userData.userId}&page=${pageNumber}&limit=${limit}`;

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
        setAllAppointments(data.data.allAppointments);
        setMetaData(data.data.metaData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const extractDateInfo = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = daysOfWeek[date.getUTCDay()];
    const dateNumber = date.getUTCDate();
    const month = monthsOfYear[date.getUTCMonth()];

    return {
      day,
      date: dateNumber,
      month,
    };
  };

  const convertUTCtoIST = (utcStartTime, utcEndTime) => {
    const startTime = DateTime.fromISO(utcStartTime, { zone: "utc" }).setZone(
      "Asia/Kolkata"
    );
    const endTime = DateTime.fromISO(utcEndTime, { zone: "utc" }).setZone(
      "Asia/Kolkata"
    );

    const startTimeString = startTime.toFormat("hh:mm a");
    const endTimeString = endTime.toFormat("hh:mm a");

    const timeRangeString = `${startTimeString} - ${endTimeString}`;

    return timeRangeString;
  };

  const getStatus = (startTime, status) => {
    const currentIST = DateTime.now().setZone("Asia/Kolkata");
    const startTimeUTC = DateTime.fromISO(startTime, { zone: "utc" });

    if (status === "canceled") {
      return "cancelled";
    } else if (status === "active" && startTimeUTC >= currentIST) {
      return "upcoming";
    } else {
      return "completed";
    }
  };

  const handleOpenUrl = (joinUrl) => {
    window.open(joinUrl, "_blank");
  };

  return (
    <div className="my-a-container">
      <div className="my-a-main-header">
        <h3>All Appointments</h3>
      </div>
      {allAppointments.length > 0 ? (
        <>
          <div className="my-a-details-section">
            {allAppointments.map((item) => {
              const dateInfo = extractDateInfo(item.startTime);
              const dateRange = convertUTCtoIST(item.startTime, item.endTime);
              const status = getStatus(item.startTime, item.status);
              return (
                <div key={item._id} className="my-ad-details-section-container">
                  <div className="my-ad-details-section-container-part">
                    <div className="my-ad-date-section">
                      <p>{dateInfo.day}</p>
                      <h3>{dateInfo.date}</h3>
                      <p>{dateInfo.month}</p>
                    </div>
                    <div className="my-ad-second-section">
                      <div className="my-ad-time-section">
                        <BsFillClockFill className="my-ad-clock-icon" />
                        <p className="my-ad-time-text">{dateRange}</p>
                      </div>
                      <div
                        className={
                          status === "cancelled"
                            ? "my-ad-status-sec cancelled"
                            : "my-ad-status-sec"
                        }
                      >
                        <p>{status}</p>
                      </div>
                    </div>
                    <div className="my-ad-third-section">
                      <h4>{item.scheduledEventName}</h4>
                      <p>
                        <span>Patient:</span> {item.patientName},{" "}
                        {item.patientMobileNumber}
                      </p>
                    </div>
                  </div>
                  <div className="my-ad-btn-section">
                    <button
                      onClick={() => handleOpenUrl(item.joinUrl)}
                      className="my-ad-join-meeting-btn"
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="my-a-bottom-nav">
            <div className="my-a-showing-text-label">
              <span>{`Showing ${startBookingIndex}-${endBookingIndex} of ${metaData.totalAppointmentCount}`}</span>
            </div>
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="my-a-previous-btn"
            >
              &lt;
            </button>
            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber === metaData.totalPages}
              className="my-a-next-btn"
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <div>No Appointments Available</div>
      )}
    </div>
  );
};

export default memo(MyAppointmentsPage);
