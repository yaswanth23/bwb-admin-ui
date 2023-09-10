import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./routes/home-route/home-route.component"));
const LoginPage = lazy(() => import("./pages/login-page/login-page.component"));

const App = () => {
  return (
    <>
      <Suspense>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
