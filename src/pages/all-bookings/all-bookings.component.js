import { memo, useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import "./all-bookings.styles.css";

import { selectUserData } from "../../store/user/user.selector";

const AllBookingsPage = () => {
  const apiUrl = process.env.REACT_APP_BE_LOGIN_API_URL;
  const userData = useSelector(selectUserData);
  const [diagnosticBookings, setDiagnosticBookings] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [bookingStates, setBookingStates] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("complete sample picked up");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const startBookingIndex = (pageNumber - 1) * limit + 1;
  const endBookingIndex =
    diagnosticBookings.length > 0
      ? Math.min(startBookingIndex + limit - 1, metaData.totalBookingCount)
      : 0;

  useEffect(() => {
    fetchDiagnosticBookings();
  }, [pageNumber]);

  useEffect(() => {
    if (bookingStates.length > 0) {
      bookingStates.map((item) => {
        if (item.stateId === 5 && !item.isActive) {
          setButtonLabel("complete sample picked up");
        } else if (item.stateId === 5 && item.isActive) {
          setButtonLabel("complete report generated");
        }

        if (item.stateId === 6 && item.isActive) {
          setButtonLabel("upload reports");
        }
      });
    }
  }, [bookingStates]);

  const fetchDiagnosticBookings = () => {
    const apiEndpoint =
      apiUrl +
      "/get/partner/diagnostics/bookings?userId=" +
      userData.userId +
      "&page=" +
      pageNumber +
      "&limit=" +
      limit;
    fetch(apiEndpoint, {
      method: "GET",
      headers: {
        Authorization:
          "eyJhbGciOiJIUzUxMiJ9.eyJzZWNyZXQiOiJiZmE3MzhhNjdkOGU5NGNmNDI4ZTdjZWE5Y2E1YzY3YiJ9.o4k544e1-NWMTBT28lOmEJe_D4TMOuwb11_rXLWb_SNhd6Oq70lWWqVdHzenEr1mhnVTDAtcOufnc4CMlIxUiw",
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
        setDiagnosticBookings(data.data.diagnosticBookings);
        setMetaData(data.data.metaData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const formatCreatedOn = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openModal = (bookingId) => {
    setBookingId(bookingId);
    fetchBookingDetails(bookingId);
    setModalIsOpen(true);
  };

  const fetchBookingDetails = (bookingId) => {
    const apiEndpoint =
      apiUrl + `/details/diagnostics/bookings/${userData.userId}/${bookingId}`;
    fetch(apiEndpoint, {
      method: "GET",
      headers: {
        Authorization:
          "eyJhbGciOiJIUzUxMiJ9.eyJzZWNyZXQiOiJiZmE3MzhhNjdkOGU5NGNmNDI4ZTdjZWE5Y2E1YzY3YiJ9.o4k544e1-NWMTBT28lOmEJe_D4TMOuwb11_rXLWb_SNhd6Oq70lWWqVdHzenEr1mhnVTDAtcOufnc4CMlIxUiw",
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
        setBookingDetails(data.data.bookingDetails[0]);
        setBookingStates(data.data.bookingDetails[0].bookingStates);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleBookingStateUpdate = () => {
    const apiEndpoint = apiUrl + "/update/booking/status";
    let stateId = buttonLabel == "complete sample picked up" ? 5 : 6;
    const requestData = {
      userId: userData.userId,
      bookingId: bookingDetails._id,
      stateId: stateId,
    };
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization:
          "eyJhbGciOiJIUzUxMiJ9.eyJzZWNyZXQiOiJiZmE3MzhhNjdkOGU5NGNmNDI4ZTdjZWE5Y2E1YzY3YiJ9.o4k544e1-NWMTBT28lOmEJe_D4TMOuwb11_rXLWb_SNhd6Oq70lWWqVdHzenEr1mhnVTDAtcOufnc4CMlIxUiw",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchBookingDetails(bookingId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const apiEndpoint = apiUrl + "/upload/reports";
        const response = await fetch(apiEndpoint, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setUploadedFiles([...uploadedFiles, ...responseData.data]);
          setButtonLabel("submit");
        } else {
          console.error("File upload failed");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    },
    [uploadedFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleFileRemoval = async (fileKey) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.url !== fileKey));
  };

  const handleSubmitReports = () => {
    const apiEndpoint = apiUrl + "/submit/reports";

    const requestData = {
      bookingId: bookingDetails._id,
      fileUrls: uploadedFiles,
    };
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization:
          "eyJhbGciOiJIUzUxMiJ9.eyJzZWNyZXQiOiJiZmE3MzhhNjdkOGU5NGNmNDI4ZTdjZWE5Y2E1YzY3YiJ9.o4k544e1-NWMTBT28lOmEJe_D4TMOuwb11_rXLWb_SNhd6Oq70lWWqVdHzenEr1mhnVTDAtcOufnc4CMlIxUiw",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchBookingDetails(bookingId);
        setUploadedFiles([]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="all-bookings-container">
        <div className="all-bookings-main-header">
          <h3>All Bookings</h3>
        </div>
        {diagnosticBookings.length > 0 ? (
          <div className="all-bookings-item-container">
            <div className="all-bookings-table-container">
              <table className="all-bookings-table-main">
                <thead>
                  <tr>
                    <th>Booking Id</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosticBookings.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "even-row" : "odd-row"}
                    >
                      <td
                        onClick={() => {
                          openModal(item._id);
                        }}
                      >
                        {item._id}
                      </td>
                      <td>{formatCreatedOn(item.createdOn)}</td>
                      <td>
                        <span className="all-bookings-price-symbol">
                          &#8377;
                        </span>
                        {item.totalPrice}
                      </td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="all-booking-bottom-nav">
              <div className="all-booking-showing-text-label">
                <span>{`Showing ${startBookingIndex}-${endBookingIndex} of ${metaData.totalBookingCount}`}</span>
              </div>
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="all-booking-previous-btn"
              >
                &lt;
              </button>
              <button
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber === metaData.totalPages}
                className="all-booking-next-btn"
              >
                &gt;
              </button>
            </div>
          </div>
        ) : (
          <div>No Bookings</div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        preventScroll={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          content: {
            padding: 0,
            border: "none",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        ariaHideApp={false}
      >
        <div className="all-booking-modal-container">
          {bookingDetails && (
            <>
              <div className="all-booking-modal-header-main">
                <span>Booking Id: {bookingDetails._id}</span>
                <RxCross2
                  className="all-booking-modal-cancel-icon"
                  onClick={closeModal}
                />
              </div>
              <div className="all-booking-stepper-container">
                <div className="all-booking-stepper-section">
                  {bookingStates.length > 0 && (
                    <>
                      {bookingStates.map((step, index) => (
                        <div
                          key={step.stateId}
                          className={
                            step.isActive ? "step-item complete" : "step-item"
                          }
                        >
                          <div className="step">
                            {step.isActive ? (
                              <TiTick className="tick-icon" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <p>{step.stateName}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="all-booking-modal-body-container">
                <div className="all-booking-md-note-section">
                  <p>
                    1. Click on "Complete sample picked up" button once you
                    successfully collect the sample.
                  </p>
                  <p>
                    2. Click on "Complete report generated" button once the
                    reports are generated. Upload reports here once it is
                    available.
                  </p>
                  <p>3. In case of assistance contact customer service.</p>
                </div>
                <div className="all-booking-button-container">
                  {buttonLabel == "upload reports" ||
                  buttonLabel == "submit" ? (
                    <>
                      <div>
                        <div {...getRootProps()} className="file-uploader">
                          <input {...getInputProps()} />
                          <p>
                            Drag & drop some files here, or click to select
                            files
                          </p>
                        </div>
                        <div className="file-list">
                          <h2>
                            Uploaded Files:{" "}
                            <span>
                              {bookingDetails.reports.length} files has been
                              uploaded!
                            </span>
                          </h2>
                          <ul>
                            {uploadedFiles?.map((file) => (
                              <li key={file.url}>
                                {file.url}
                                <button
                                  onClick={() => handleFileRemoval(file.url)}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {buttonLabel == "submit" ? (
                        <button
                          className="all-booking-btn"
                          onClick={handleSubmitReports}
                        >
                          {buttonLabel}
                        </button>
                      ) : (
                        <button className="all-booking-btn">
                          {buttonLabel}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="all-booking-btn"
                      onClick={handleBookingStateUpdate}
                    >
                      {buttonLabel}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default memo(AllBookingsPage);
