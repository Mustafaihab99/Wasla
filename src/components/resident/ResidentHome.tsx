import { motion } from "framer-motion";
import { FaSearch, FaTools, FaStethoscope, FaTaxi } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { MdFitnessCenter } from "react-icons/md";
import ResidentGallery from "./ResidentGallery";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ResidentHome() {
    const {t} = useTranslation();
    const navigate = useNavigate();

  return (
    <div className="pt-24 px-4 lg:px-20">

      {/* Welcome */}
      <section className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
        {t("resident.welcome")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted mb-6"
        >
          {t("resident.allhome")}  
        </motion.p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex items-center bg-background border border-border rounded-full p-3 shadow">
          <FaSearch className="text-primary mx-2" />
          <input
            type="text"
            placeholder= {t("resident.look")}
            className="flex-1 bg-transparent outline-none text-foreground"
          />
        </div>
      </section>
      <ResidentGallery />
      {/* Services*/}
      <section className="mb-20">
        <h3 className="text-xl font-semibold mb-6">{t("resident.allservice")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[
              { title: t("resident.doctor"), icon: <FaStethoscope /> , link: "/resident/service/doctors" },
              { title: t("resident.rest"), icon: <IoRestaurant />  ,link: "/resident/service/restaurants"},
              { title: t("resident.technical"), icon: <FaTools /> , link: "/resident/service/technicans"},
              { title: t("resident.gym"), icon: <MdFitnessCenter /> , link: "/resident/service/gyms"},
              { title: t("resident.driver"), icon: <FaTaxi /> , link: "/resident/service/drivers"},
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-5 border border-border rounded-xl bg-background shadow flex flex-col items-center gap-3 cursor-pointer hover:bg-primary/10"
              onClick={()=>navigate(s.link)}
            >
              <div className="text-primary text-3xl">{s.icon}</div>
              <p className="font-semibold text-foreground text-center">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
