import { motion, easeOut } from "framer-motion";
import { FaUsers, FaBuilding, FaShieldAlt, FaBell, FaCogs, FaChartLine } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ServicesSection() {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const services = [
    {
      icon: <FaUsers />,
      title: t("services.communityManagement"),
      text:
        t("services.communityDesc") ,
      color: "from-indigo-500/10 to-indigo-400/5",
    },
    {
      icon: <FaBuilding />,
      title: t("services.propertyServices") ,
      text:
        t("services.propertyDesc") ,
      color: "from-blue-500/10 to-blue-400/5",
    },
    {
      icon: <FaShieldAlt />,
      title: t("services.security"),
      text:
        t("services.securityDesc"),
      color: "from-emerald-500/10 to-emerald-400/5",
    },
    {
      icon: <FaBell />,
      title: t("services.notifications"),
      text:
        t("services.notificationsDesc"),
      color: "from-yellow-400/10 to-yellow-300/5",
    },
    {
      icon: <FaCogs />,
      title: t("services.automation"),
      text:
        t("services.automationDesc"),
      color: "from-purple-500/10 to-purple-400/5",
    },
    {
      icon: <FaChartLine />,
      title: t("services.analytics"),
      text:
        t("services.analyticsDesc"),
      color: "from-pink-500/10 to-pink-400/5",
    },
  ];

  return (
    <section
      id="services"
      className="relative w-full py-24 bg-gradient-to-b from-background via-background/80 to-background overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(16,185,129,0.1),transparent_60%)]"></div>

      <div className="relative container mx-auto px-6 lg:px-12 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            {t("services.title")}
          </h2>
          <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        {/* الكروت */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`bg-gradient-to-br ${service.color} border border-border p-8 rounded-2xl 
              shadow-sm hover:shadow-lg backdrop-blur-sm transition-all duration-300 h-full`}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="p-4 rounded-full bg-primary/10 text-primary text-3xl">
                  {service.icon}
                </span>
                <h4 className="font-semibold text-lg text-foreground">{service.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
