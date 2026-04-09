import TechnicianCharts from "../../components/technician/TechnicianCharts";
import TechnicianJobs from "../../components/technician/TechnicianJobs";
import { useTranslation } from "react-i18next";

export default function TechnicianOverView() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      
      {/* Charts Section */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">
          {t("tech.dashboard")}
        </h1>

        <TechnicianCharts />
      </section>

      {/* Jobs Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          {t("tech.jobsTitle")}
        </h2>

        <TechnicianJobs />
      </section>

    </div>
  );
}