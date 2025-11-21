import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorDashboard from "../../components/serviceDashboards/DoctorDashboard";
import ResidentDashboard from "../../components/serviceDashboards/ResidentDashboard";
import { toast } from "sonner";

export default function MainDashboard() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const roleComponents: Record<string, React.FC> = {
    doctor: DoctorDashboard,
    resident: ResidentDashboard,
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
  if (role === "doctor") {
      navigate("/doctor/manage-dashboard", { replace: true });
    }
  const RoleDashboard = roleComponents[role];

  if (!RoleDashboard) {
    return <p>Invalid role</p>;
  }

  return <RoleDashboard />;
}
