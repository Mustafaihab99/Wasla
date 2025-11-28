import { motion } from "framer-motion";
import { FaStethoscope, FaTools, FaTaxi, FaSearch } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { MdFitnessCenter } from "react-icons/md";
import ResidentGallery from "./ResidentGallery";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import healthTips from "../../utils/Tips";
import skin from "../../assets/images/detrmonlogy.jpg";
import fit from "../../assets/images/fitness.jpg";
import plumber from "../../assets/images/plumber.jpg";

export default function ResidentHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tip, setTip] = useState("");

  useEffect(() => {
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setTip(randomTip);
  }, []);

  const services = [
    {
      title: t("resident.doctor"),
      icon: <FaStethoscope />,
      link: "/resident/service/doctors",
      color: "from-primary to-indigo-500",
    },
    {
      title: t("resident.rest"),
      icon: <IoRestaurant />,
      link: "/resident/service/restaurants",
      color: "from-rose-400 to-rose-600",
    },
    {
      title: t("resident.technical"),
      icon: <FaTools />,
      link: "/resident/service/technicans",
      color: "from-amber-400 to-amber-600",
    },
    {
      title: t("resident.gym"),
      icon: <MdFitnessCenter />,
      link: "/resident/service/gyms",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      title: t("resident.driver"),
      icon: <FaTaxi />,
      link: "/resident/service/drivers",
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  const popularCategories = [
    { txt: t("resident.Dermatology"), img: skin },
    { txt: t("resident.technican"), img: plumber },
    { txt: t("resident.Fitness"), img: fit },
  ];

  return (
    <div className="pt-24 px-4 lg:px-20 space-y-16">
      {/* HERO */}
      <section className="text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          {t("resident.welcome")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted text-lg md:text-xl mt-4 max-w-2xl mx-auto">
          {t("resident.allhome")}
        </motion.p>

        {/* Search */}
        <div className="max-w-xl mx-auto flex items-center backdrop-blur-md border border-dried rounded-full p-4 mt-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <input
            type="text"
            placeholder={t("resident.look")}
            className="flex-1 bg-transparent outline-none text-foreground font-medium text-base md:text-lg"
          />
          <button className="ml-3 py-2 rounded-full text-primary font-semibold hover:bg-primary/90 transition">
            <FaSearch />
          </button>
        </div>
      </section>

      {/* Gallery */}
      <ResidentGallery />

      {/* Services */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8">
          {t("resident.servicesWeOffer")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="group relative p-6 rounded-2xl shadow-xl cursor-pointer bg-gradient-to-br hover:from-white/70 hover:to-white/20 transition-all duration-300"
              onClick={() => navigate(s.link)}>
              <div
                className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br ${s.color} text-white text-3xl mb-4 group-hover:scale-110 transition-all duration-300`}>
                {s.icon}
              </div>
              <p className="text-center text-lg font-semibold text-foreground">
                {s.title}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

     {/* Health Tip */}
<section className="relative p-6 sm:p-8 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer bg-white/10 backdrop-blur-2xl border border-white/20">
  {/* Gradient Overlay modern */}
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-teal-200 to-green-200 opacity-60 rounded-3xl animate-gradient-x"></div>

  {/* Floating subtle shapes */}
  <div className="absolute -top-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute -bottom-6 -left-6 w-28 sm:w-32 h-28 sm:h-32 bg-green-200/30 rounded-full blur-3xl animate-pulse delay-300"></div>

  {/* Overlay subtle */}
  <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
    <div className="flex items-center gap-2 md:gap-3 mb-4 justify-center">
      <div className="text-lg md:text-4xl animate-bounce">💡</div>
      <h3 className="text-lg  md:text-4xl font-extrabold text-black drop-shadow-md">
        {t("resident.tips")}
      </h3>
    </div>
    <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed max-w-full sm:max-w-xl md:max-w-2xl">
      {t(tip)}
    </p>
  </div>
</section>

      {/* Popular Categories */}
      <section>
        <h3 className="text-2xl font-bold mb-6">{t("resident.popular")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {popularCategories.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="relative mb-12 overflow-hidden rounded-2xl shadow-lg cursor-pointer group">
              <img
                src={c.img}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-25 transition-opacity rounded-2xl"></div>
              <p className="absolute bottom-3 w-full text-center text-white font-bold z-10">
                {c.txt}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
