import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import ("../pages/welcomePage/WelcomePage"));
const AuthLayout = lazy(() => import ("../components/layouts/AuthLayout"));
const NotFound = lazy(() => import ("../pages/notFound/NotFound"));
const Login = lazy(() => import ("../pages/auth/Login"));
const ForgetPassword = lazy(() => import ("../pages/auth/ForgetPassword"));
const VerifyOTP = lazy(() => import ("../pages/auth/VerifyOTP"));
const ResetPassword = lazy(() => import ("../pages/auth/ResetPassword"));

export default function AppRoutes() {
  return (
      <Routes>
        {/* welcome page */}
        <Route path="/" element={<Home />} /> 
        {/* not found */}
        <Route path="*" element={<NotFound />} />
        {/* Auth Layout */}
        <Route element={<AuthLayout />} >
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgetPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Route>
        {/* End Auth Layout */}
      </Routes>
  );
}

