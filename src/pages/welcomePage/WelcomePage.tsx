import AboutSection from "../../components/landing/About";
import FooterSection from "../../components/landing/Footer";
import HeroSection from "../../components/landing/HeroSection";
import NavBar from "../../components/landing/NavBar";
import ServicesSection from "../../components/landing/ServiceSection";

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
