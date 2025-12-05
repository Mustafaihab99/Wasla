import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { circOut } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaUtensils, FaChair, FaChartLine, FaStore, FaShoppingCart, FaCommentAlt } from "react-icons/fa";

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

export default function RestaurantsSection() {
  const {t} = useTranslation();

const features = [
  {
    title: t("landing.menu"),
    desc: t("landing.menuDesc"),
    icon: <FaUtensils />,
  },
  {
    title: t("landing.table"),
    desc: t("landing.tableDesc"),
    icon: <FaChair />,
  },
  {
    title: t("landing.track"),
    desc: t("landing.trackDesc"),
    icon: <FaChartLine />,
  },
  {
    title: t("landing.resPro"),
    desc: t("landing.resProDesc"),
    icon: <FaStore />,
  },
  {
    title: t("landing.online"),
    desc: t("landing.onlineDesc"),
    icon: <FaShoppingCart />,
  },
  {
    title: t("landing.feed"),
    desc: t("landing.feedDesc"),
    icon: <FaCommentAlt />,
  },
];

  return (
    <SectionWrapper id="restaurants">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none rounded-3xl"></div>
        <motion.h2 variants={card} className="text-3xl font-bold">
          {t("landing.resServ")}
        </motion.h2>
        <motion.p variants={card} className="text-muted-foreground max-w-2xl">
          {t("landing.resServDesc")}
        </motion.p>
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
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-3 text-primary text-3xl mb-4">
                {f.icon}
              </motion.div>

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
