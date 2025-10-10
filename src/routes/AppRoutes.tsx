import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import ("../pages/welcomePage/WelcomePage"));
const AuthLayout = lazy(() => import ("../components/layouts/AuthLayout"));
const NotFound = lazy(() => import ("../pages/notFound/NotFound"));

export default function AppRoutes() {
  return (
      <Routes>
        {/* welcome page */}
        <Route path="/" element={<Home />} /> 
        {/* not found */}
        <Route path="*" element={<NotFound />} />
        {/* Auth Layout */}
        <Route path="auth" element={<AuthLayout />} >

        </Route>
        {/* End Auth Layout */}
      </Routes>
  );
}
