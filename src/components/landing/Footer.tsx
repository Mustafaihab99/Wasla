import { motion, easeOut } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/icons/app-logo.png";

export default function FooterSection() {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <footer className="relative w-full bg-background border-t border-border pt-14 pb-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_60%)]"></div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative container mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* logo */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10" />  
          <h3 className="text-2xl font-extrabold text-primary">Wasla</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("footer.about")}
          </p>
          <div className="flex gap-4 text-xl mt-4">
            <a href="#" className="hover:text-primary transition-colors">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <FaInstagram />
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeInUp}>
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {t("footer.quick")}
          </h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="#home" className="hover:text-primary transition-colors">{t("nav.home")}</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">{t("nav.about")}</a></li>
            <li><a href="#services" className="hover:text-primary transition-colors">{t("nav.service")}</a></li>
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div variants={fadeInUp}>
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {t("services.title")}
          </h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">{t("footer.Maintenance Requests")}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t("footer.Community Announcements")}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t("footer.Resident Directory")}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t("footer.Online Payments")}</a></li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={fadeInUp}>
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-primary" /> Cairo, Egypt
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary" /> contact@wasla.com
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-primary" /> +20 111 222 3333
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Bottom Line */}
      <div className="relative mt-12 border-t border-border pt-3 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-primary font-semibold">Wasla</span> — {t("footer.All rights reserved")}
        </p>
      </div>
    </footer>
  );
}
