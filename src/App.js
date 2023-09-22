import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsUserLoggedIn,
  selectUserData,
} from "./store/user/user.selector";

const Home = lazy(() => import("./routes/home-route/home-route.component"));
const LoginPage = lazy(() => import("./pages/login-page/login-page.component"));
const AllBookingsPage = lazy(() =>
  import("./pages/all-bookings/all-bookings.component")
);
const MyAppointmentsPage = lazy(() =>
  import("./pages/my-appointments/my-appointments.component")
);

const App = () => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const userData = useSelector(selectUserData);

  return (
    <>
      <Suspense>
        <Routes>
          <Route path="/" element={isUserLoggedIn ? <Home /> : <LoginPage />}>
            {userData?.roleId === 103 ? (
              <Route path="my-appointments" element={<MyAppointmentsPage />} />
            ) : (
              <Route path="all-bookings" element={<AllBookingsPage />} />
            )}
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
