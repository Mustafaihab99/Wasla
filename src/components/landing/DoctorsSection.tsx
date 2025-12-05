import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { FaCalendarCheck, FaClock, FaChartLine, FaUserMd, FaCreditCard, FaStar } from "react-icons/fa";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

import { circOut } from "framer-motion";
import { useTranslation } from "react-i18next";

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: circOut,
    },
  },
};

export default function DoctorsSection() {
  const {t} = useTranslation();

const features = [
  {
    title: t("landing.weekly"),
    desc: t("landing.weekDesc"),
    icon: <FaCalendarCheck />,
  },
  {
    title: t("landing.book"),
    desc: t("landing.bookDesc"),
    icon: <FaClock />,
  },
  {
    title: t("landing.renvue"),
    desc: t("landing.renvueDesc"),
    icon: <FaChartLine />,
  },
  {
    title: t("landing.profile"),
    desc: t("landing.profileDesc"),
    icon: <FaUserMd />,
  },
  {
    title: t("landing.payment"),
    desc: t("landing.paymentDesc"),
    icon: <FaCreditCard />,
  },
  {
    title: t("landing.rating"),
    desc: t("landing.ratingDesc"),
    icon: <FaStar />,
  },
];


  return (
    <SectionWrapper id="doctors">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-8 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none rounded-3xl"></div>

        <motion.h2 variants={card} className="text-3xl font-bold">
          {t("landing.doctorServ")}
        </motion.h2>

        <motion.p variants={card} className="text-muted-foreground max-w-2xl">
          {t("landing.doctorServDesc")}
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{
                scale: 1.04,
                rotateX: 5,
                rotateY: -5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              }}
              className="bg-background relative overflow-hidden border border-border p-6 rounded-2xl shadow-sm transition-all duration-300">
              {/* Floating Icon */}
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-3 text-primary text-3xl mb-4">
                {f.icon}
              </motion.div>

              {/* Glow Line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/30 blur-sm"></div>

              <h4 className="font-semibold text-lg mb-1">{f.title}</h4>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
