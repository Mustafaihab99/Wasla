import { motion } from "framer-motion";
import { FaTools, FaShieldAlt, FaBolt } from "react-icons/fa";
import { SectionWrapper } from "./SectionWrapper";
import { circOut } from "framer-motion";
import { useTranslation } from "react-i18next";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: circOut },
  },
};

export default function TechsSection() {
  const {t} = useTranslation();
  const features = [
    {
      title: t("landing.electric"),
      desc: t("landing.elecDesc"),
      icon: <FaBolt />,
    },
    {
      title: t("landing.plumber"),
      desc: t("landing.plumDesc"),
      icon: <FaTools />,
    },
    {
      title: t("landing.tech"),
      desc: t("landing.techDesc"),
      icon: <FaShieldAlt />,
    },
  ];

  return (
    <SectionWrapper id="techs">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-8">
        <motion.h3 variants={card} className="text-3xl font-bold">
          {t("landing.techServ")}
        </motion.h3>
        <motion.p variants={card} className="text-muted-foreground max-w-2xl">
          {t("landing.techServDesc")}
        </motion.p>
        <motion.div
          variants={container}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="bg-background relative overflow-hidden border border-border p-6 rounded-2xl shadow-sm flex items-start gap-4">
              {" "}
              <div className="p-3 bg-primary/10 text-primary rounded-lg text-2xl">
                {f.icon}
              </div>{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-lg">{f.title}</h4>{" "}
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>{" "}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>{" "}
    </SectionWrapper>
  );
}
