import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";

import gym from "../../assets/images/gym-landing.avif";
import doctor from "../../assets/images/doctor-landing.png";
import driver from "../../assets/images/driver-landing.jpeg";
import plumber from "../../assets/images/plumper-landing.jpg";
import community from "../../assets/images/community-landing.jpg";
import restaurant from "../../assets/images/restaurant-landing.avif";
import { useTranslation } from "react-i18next";

const images = [
  gym,
  doctor,
  driver,
  plumber,
  community,
  restaurant
];

export default function GallerySection() {
    const {t} =useTranslation();
  return (
    <SectionWrapper id="gallery" className="py-20">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-6">
        {t("landing.community")}
      </motion.h3>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={src}
              alt={`Gallery ${i}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
