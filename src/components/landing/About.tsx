import { motion, easeOut } from "framer-motion";
import { FaHome, FaHandsHelping, FaSmile } from "react-icons/fa";
import communityImage from "../../assets/images/neighboor.jpg";
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2, // تأخير بسيط بين العناصر
      },
    },
  };

  return (
    <section
      id="about"
      className="relative w-full py-20 lg:py-28 bg-gradient-to-b from-background via-background/80 to-background overflow-hidden"
    >
      {/* خلفية متحركة خفيفة */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(16,185,129,0.1),transparent_60%)] animate-pulse"></div>

      <div className="relative container mx-auto px-6 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left - Image */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] group">
              <div className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>

              <img
                src={communityImage}
                alt="Community connection"
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-border 
                group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>

          {/* Right - Text */}
          <motion.div
            variants={fadeInUp}
            className="space-y-8 text-center lg:text-left max-w-xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              {t("about.building")} 
              <span className="text-primary">{t("about.Smarter Communities")}</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.wasla")}
            </p>

            {/* Feature Cards */}
            <motion.div
              variants={container}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4"
            >
              {[
                {
                  icon: <FaHome />,
                  title: t("about.comfort"),
                  text: t("about.manage"),
                  color: "from-blue-500/10 to-blue-400/5",
                },
                {
                  icon: <FaHandsHelping />,
                  title: t("about.trusted"),
                  text: t("about.access"),
                  color: "from-green-500/10 to-green-400/5",
                },
                {
                  icon: <FaSmile />,
                  title: t("about.live"),
                  text: t("about.strenght"),
                  color: "from-yellow-400/10 to-yellow-300/5",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`bg-gradient-to-br ${feature.color} border border-border p-6 rounded-2xl 
                  shadow-sm hover:shadow-lg backdrop-blur-sm transition-all duration-300 h-full flex flex-col justify-between`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <span className="p-4 rounded-full bg-primary/10 text-primary text-2xl">
                      {feature.icon}
                    </span>
                    <h4 className="font-semibold text-foreground text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {feature.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
