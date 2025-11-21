import { Outlet } from "react-router-dom";
import ResidentNavBar from "../resident/NavBarResident";
import ResidentFooter from "../resident/ResidentFooter";

export default function ResidentLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ResidentNavBar />
      <main className="flex-1 pt-24 pb-10 px-4 lg:px-10 flex justify-center">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
      <ResidentFooter />
    </div>
  );
}
