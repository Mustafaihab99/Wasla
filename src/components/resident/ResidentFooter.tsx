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
import { Link, useNavigate } from "react-router-dom";

export default function ResidentFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <footer className="relative w-full bg-background border-t border-border pt-16 pb-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(99,102,241,0.10),transparent_70%)] pointer-events-none"></div>

      {/* Main Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto px-6 lg:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* Logo + About */}
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="logo"
              className="w-11 h-11 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h3 className="text-2xl font-bold text-primary">Wasla</h3>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("footer.about")}
          </p>

          <div className="flex gap-4 text-xl mt-4">
            {[FaFacebook, FaTwitter, FaInstagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="hover:text-primary transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeIn}>
          <h4 className="text-lg font-semibold mb-4 text-foreground">
            {t("footer.quick")}
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-primary"> {t("nav.home")} </Link></li>
            <li><Link to="/resident/service" className="hover:text-primary"> {t("resident.service")} </Link></li>
            <li><Link to="/resident/inbox" className="hover:text-primary"> {t("resident.inbox")} </Link></li>
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div variants={fadeIn}>
          <h4 className="text-lg font-semibold mb-4 text-foreground">
            {t("services.title")}
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">{t("footer.Maintenance Requests")}</a></li>
            <li><a href="#" className="hover:text-primary">{t("footer.Community Announcements")}</a></li>
            <li><a href="#" className="hover:text-primary">{t("footer.Resident Directory")}</a></li>
            <li><a href="#" className="hover:text-primary">{t("footer.Online Payments")}</a></li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={fadeIn}>
          <h4 className="text-lg font-semibold mb-4 text-foreground">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3"><FaMapMarkerAlt className="text-primary" /> Cairo, Egypt</li>
            <li className="flex items-center gap-3"><FaEnvelope className="text-primary" /> contact@wasla.com</li>
            <li className="flex items-center gap-3"><FaPhone className="text-primary" /> +20 111 222 3333</li>
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
