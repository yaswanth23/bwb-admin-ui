import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsUserLoggedIn } from "./store/user/user.selector";

const Home = lazy(() => import("./routes/home-route/home-route.component"));
const LoginPage = lazy(() => import("./pages/login-page/login-page.component"));
const AllBookingsPage = lazy(() =>
  import("./pages/all-bookings/all-bookings.component")
);

const App = () => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
    <>
      <Suspense>
        <Routes>
          <Route path="/" element={isUserLoggedIn ? <Home /> : <LoginPage />}>
            <Route path="all-bookings" element={<AllBookingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
