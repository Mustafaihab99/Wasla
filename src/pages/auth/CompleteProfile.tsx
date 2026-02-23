import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoctorFormFields from "../../components/auth/DoctorFormFields";
import NavBar from "../../components/landing/NavBar";
import FooterSection from "../../components/landing/Footer";
import ResidentFormFields from "../../components/auth/ResidentFormFields";
import GymFormFields from "../../components/auth/GymFormFields";

export default function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const email = location.state?.email;
  const role = location.state?.role;
  

  if (!email || !role) {
    navigate("/auth/signup");
    return null;
  }

  const roleComponents: Record<string, React.FC<{ email: string }>> = {
    doctor: DoctorFormFields,
    resident: ResidentFormFields,
    gym: GymFormFields,
    // restaurant: RestaurantFormFields,
    // technician: TechnicianFormFields,
  };

  const RoleForm = roleComponents[role];

  if (!RoleForm) {
    return <p>{t("Invalid role")}</p>;
  }

  return (
    <>
    <NavBar />
    <motion.div
      className="w-full p-6 px-12 mt-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
    <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
        {t("profile.complete")}
    </h2>

    <RoleForm email={email} />
    </motion.div>
    <FooterSection />
  </>
  );
}
