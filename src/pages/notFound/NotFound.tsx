import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/images/icons/app-logo.png";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const {t} = useTranslation();

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <motion.img
        src={logo}
        alt="Not Found"
        loading="lazy"
        className="w-40 h-40 mb-6 opacity-80"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
       {t("notfound.404")}
      </motion.h1>

      <motion.p
        className="text-lg text-muted-foreground mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {t("notfound.oops")}
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-300"
        >
          {t("notfound.back")}
        </Link>
      </motion.div>
    </div>
  );
}
