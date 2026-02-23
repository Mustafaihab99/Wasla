import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStethoscope, FaTools, FaTaxi, FaSearch } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { MdFitnessCenter } from "react-icons/md";
import ResidentActivitySection from "./ResidentActivitySection";
import healthTips from "../../utils/Tips";
import community from "../../assets/images/collprate.jpg";
import ContactSection from "../landing/ContactSection";

export default function ResidentHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tip, setTip] = useState("");
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setTip(randomTip);
  }, []);

  const services = [
    {
      title: t("resident.doctor"),
      icon: <FaStethoscope />,
      link: "/resident/service/doctors",
    },
    {
      title: t("resident.rest"),
      icon: <IoRestaurant />,
      link: "/resident/service/restaurants",
    },
    {
      title: t("resident.technical"),
      icon: <FaTools />,
      link: "/resident/service/technicans",
    },
    {
      title: t("resident.gym"),
      icon: <MdFitnessCenter />,
      link: "/resident/service/gyms",
    },
    {
      title: t("resident.driver"),
      icon: <FaTaxi />,
      link: "/resident/service/drivers",
    },
  ];

  return (
    <div className="pt-24 px-4 lg:px-20 space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-indigo-500/10 to-purple-500/10 p-10 md:p-16">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl opacity-40"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {t("resident.welcome")} 👋
            </h1>

            <p className="text-lg text-muted max-w-md">
              {t("resident.allhome")}
            </p>

            {/* Search */}
            <div className="flex items-center bg-background backdrop-blur rounded-xl px-4 py-3 shadow-xl border border-white/40">
              <input
                type="text"
                placeholder={t("resident.look")}
                className="flex-1 bg-transparent outline-none text-base"
                onFocus={() => navigate("/resident/service")}
              />
              <FaSearch className="text-primary text-lg" />
            </div>
          </div>

          <div className="relative hidden md:flex justify-center">
            <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-2xl border border-white/40">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-indigo-500/20"></div>

              <img
                src={community}
                alt="community"
                className="w-full h-full object-cover scale-110 hover:scale-125 transition duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => navigate(service.link)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-background shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border">
              <div className="text-4xl text-primary mb-3">{service.icon}</div>
              <p className="text-sm font-semibold text-center">
                {service.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {userId && <ResidentActivitySection userId={userId} />}

      <section className="relative  overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500/10 via-primary/10 to-purple-500/10 p-8 shadow-xl">
        <div className="absolute inset-0 backdrop-blur-xl bg-white/10"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl shadow-lg animate-pulse">
            💡
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{t("resident.tips")}</h3>
            <p className="text-muted text-sm md:text-base leading-relaxed">
              {t(tip)}
            </p>
          </div>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
