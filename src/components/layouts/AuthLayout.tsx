import { Outlet } from "react-router-dom";
import authImage from "../../assets/images/Community.png";

const NavBar = lazy(() => import ("../landing/NavBar")) ;
const FooterSection = lazy(() => import ("../landing/Footer")) ;

import { lazy } from "react";

export default function AuthLayout(){
    return(
        <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="container flex flex-col items-center lg:flex-row flex-1">
                <div className="flex flex-1 items-center justify-between py-6 lg:py-0">
                  <Outlet />
                </div>
                <div className="hidden lg:block lg:w-1/2">
                  <img
                    src={authImage}
                    loading="lazy"
                    alt="Auth"
                    className=""
                  />
                </div>
              </main>
              <FooterSection />
            </div>
    );
}