import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";

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
// main dashboard
const MainDashboard = lazy(() => import ("../pages/dashboard/MainDashboard"));
// resident dashboard
const ResidentDashboard = lazy(() => import ("../components/layouts/ResidentLayout"));
const ResidentProfile = lazy(() => import ("../components/resident/ResidentProfile"));
const ResidentServices = lazy(() => import ("../components/resident/ResidentServices"));
const ServiceBookDoctor = lazy(() => import ("../pages/resident/ServiceBookDoctor"));
const DoctorViewDetailes = lazy(() => import ("../pages/resident/DoctorViewDetailes"));
const ResidentMyBooking = lazy(() => import ("../pages/resident/ResidentMyBooking"));
// doctor dashboard
const DoctorDashboard = lazy(() => import ("../components/serviceDashboards/DoctorDashboard"));
const DoctorHomeDashboard = lazy(() => import ("../components/doctor/DoctorHomeDahboard"));
const DoctorServiceManage = lazy(() => import ("../components/doctor/DoctorServiceManage"));
const DoctorProfile = lazy(() => import ("../components/doctor/DoctorProfile"));

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

        {/* main Dashboard */}
          <Route path="/dashboard" element={<MainDashboard />} />
        {/* end main Dashboard */}

        {/* resident Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["resident"]} />}>
          <Route path="/resident" element={<ResidentDashboard />}>
            <Route path="profile" element={<ResidentProfile />} />
            <Route path="profile/my-bookings" element={<ResidentMyBooking />} />
            <Route path="service" element={<ResidentServices />} /> 
            <Route path="service/doctors" element={<ServiceBookDoctor />} /> 
            <Route path="service/doctors/:doctorId" element={<DoctorViewDetailes />} /> 
          </Route>
        </Route>  
        {/* end resident Dashboard */}

        {/* doctor Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        {/* Doctor layout */}
        <Route path="/doctor" element={<DoctorDashboard />}>
          <Route index element={<Navigate to="manage-dashboard" replace />} />
          <Route path="manage-dashboard" element={<DoctorHomeDashboard />} />
          <Route path="manage-service" element={<DoctorServiceManage />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
      </Route> 
        {/* end resident Dashboard */}
      </Routes>
  );
}

