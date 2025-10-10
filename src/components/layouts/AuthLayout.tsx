import { Outlet } from "react-router-dom";
import authImage from "../../assets/images/Community.png";
import NavBar from "../landing/NavBar";
import FooterSection from "../landing/Footer";


export default function AuthLayout(){
    return(
        <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex flex-col items-center justify-between lg:flex-row flex-1 mt-20">
                <div className="flex items-center w-full justify-between py-6 lg:py-0 lg:w-[50%]">
                  <Outlet />
                </div>
                <div className="hidden lg:block lg:w-[40%]">
                  <img
                    src={authImage}
                    loading="lazy"
                    alt="Auth"
                    className="w-[350px] h-[250px]"
                  />
                </div>
              </main>
              <FooterSection />
            </div>
    );
}