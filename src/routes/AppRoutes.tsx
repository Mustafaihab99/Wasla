import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import ("../pages/welcomePage/WelcomePage"));

export default function AppRoutes() {
  return (
      <Routes>
        {/* App layout */}
        {/* {/* <Route element={<AppLayout />}> */}
        <Route path="/" element={<Home />} /> 
        {/* </Route> */}
        {/* end of app layout */}
      </Routes>
  );
}
