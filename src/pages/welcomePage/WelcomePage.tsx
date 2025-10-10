import { lazy } from "react";

const AboutSection = lazy(() => import("../../components/landing/About"));
const FooterSection = lazy(() => import("../../components/landing/Footer"));
const HeroSection = lazy(() =>import("../../components/landing/HeroSection"));
const NavBar = lazy(() => import("../../components/landing/NavBar"));
const ServicesSection = lazy(() =>import("../../components/landing/ServiceSection"));

export default function Home() {
  
  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FooterSection />
    </>
  );
}
