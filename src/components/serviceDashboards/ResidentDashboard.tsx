import ResidentNavBar from "../resident/NavBarResident";
import ResidentFooter from "../resident/ResidentFooter";
import ResidentHome from "../resident/ResidentHome";

export default function ResidentDashboard(){
    return(
        <>
        <ResidentNavBar />
        <ResidentHome />
        <ResidentFooter />
        </>
    );
}