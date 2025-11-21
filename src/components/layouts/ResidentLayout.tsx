import { Outlet } from "react-router-dom";
import ResidentNavBar from "../resident/NavBarResident";
import ResidentFooter from "../resident/ResidentFooter";


export default function ResidentLayout(){
    return(
        <div className="flex flex-col min-h-screen">
              <ResidentNavBar />
              <main className="flex flex-col items-center justify-between lg:flex-row flex-1 mt-20">
                <div className="flex items-center w-full justify-between py-6 lg:py-0 lg:w-[50%]">
                  <Outlet />
                </div>
              </main>
              <ResidentFooter />
            </div>
    );
}