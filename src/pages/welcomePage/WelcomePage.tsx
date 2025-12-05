import { lazy, Suspense } from "react";
import NavBar from "../../components/landing/NavBar";
import { motion } from "framer-motion";
import FooterSection from "../../components/landing/Footer";
import GallerySection from "../../components/landing/GallerySection";

const HeroSection = lazy(() => import("../../components/landing/HeroSection"));
const AboutSection = lazy(() => import("../../components/landing/About"));
const ServicesSection = lazy(
  () => import("../../components/landing/ServiceSection")
);
const DoctorsSection = lazy(
  () => import("../../components/landing/DoctorsSection")
);
const RestaurantsSection = lazy(
  () => import("../../components/landing/RestaurantsSection")
);
const GymSection = lazy(() => import("../../components/landing/GymSection"));
const DriversSection = lazy(
  () => import("../../components/landing/DriversSection")
);
const TechsSection = lazy(
  () => import("../../components/landing/TechsSection")
);
const ContactSection = lazy(
  () => import("../../components/landing/ContactSection")
);

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <NavBar />

      <main className="mt-[60px]">
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-black/85 z-50">
              <motion.div
                className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>
          }>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <div className="container mx-auto px- lg:px-12">
            <DoctorsSection />
            <RestaurantsSection />
            <GymSection />
            <DriversSection />
            <TechsSection />
            <GallerySection />
            <ContactSection />
          </div>
        </Suspense>
      </main>

      <FooterSection />
    </div>
  );
}
