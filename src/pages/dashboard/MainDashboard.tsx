import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResidentDashboard from "../../components/serviceDashboards/ResidentDashboard";
import { toast } from "sonner";
import DoctorWelcomeScreen from "../../components/serviceDashboards/WelcomeScreenDoctor";
import AdminWelcomeScreen from "../../components/serviceDashboards/AdminWelcomeScreen";
import GymWelcomeScreen from "../../components/serviceDashboards/GymWelcomeScreen";

export default function MainDashboard() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const roleComponents: Record<string, React.FC> = {
    doctor: DoctorWelcomeScreen,
    resident: ResidentDashboard,
    admin: AdminWelcomeScreen,
    gym : GymWelcomeScreen,
    // restaurant: RestaurantDashboard,
    // technician: TechnicianDashboard,
  };

  useEffect(() => {
    if (!role) {
    toast.error("You must log in first");
    navigate("/auth/login");
    }
  }, [role, navigate]);

  if (!role) return null;

  const RoleDashboard = roleComponents[role];

  if (!RoleDashboard) {
    return <p>Invalid role</p>;
  }

  return <RoleDashboard />;
}
