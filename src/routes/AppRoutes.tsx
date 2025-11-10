import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import ("../pages/welcomePage/WelcomePage"));
// Auth
const AuthLayout = lazy(() => import ("../components/layouts/AuthLayout"));
const NotFound = lazy(() => import ("../pages/notFound/NotFound"));
const Login = lazy(() => import ("../pages/auth/Login"));
const ForgetPassword = lazy(() => import ("../pages/auth/ForgetPassword"));
const VerifyOTP = lazy(() => import ("../pages/auth/VerifyOTP"));
const ResetPassword = lazy(() => import ("../pages/auth/ResetPassword"));
const SignUp = lazy(() => import ("../pages/auth/SignUp"));
const VerifyEmail = lazy(() => import ("../pages/auth/VerifyEmail"));
const CompleteProfile = lazy(() => import ("../pages/auth/CompleteProfile"));

export default function AppRoutes() {
  return (
      <Routes>
        {/* welcome page */}
        <Route path="/" element={<Home />} /> 
        {/* not found */}
        <Route path="*" element={<NotFound />} />
        {/* Auth Layout */}
        <Route element={<AuthLayout />} >
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgetPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Route>
          <Route path="/auth/complete-profile" element={<CompleteProfile />} />
        {/* End Auth Layout */}
      </Routes>
  );
}

