import { useState } from "react";
import useGetDoctorProfile from "../../hooks/doctor/useDoctorProfile";
import ChangePasswordModal from "../common/ChangePasswordModal";
import EditDoctorProfileModal from "../common/EditProfileModal";
import { FaEdit, FaLock } from "react-icons/fa";
import DoctorProfileSkeleton from "./DoctorProfileSkeleton";
import { useTranslation } from "react-i18next";

export default function DoctorProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetDoctorProfile(id);
  const {t} = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  if (isLoading) {
    return <DoctorProfileSkeleton />
  }

  if (!data) return <p>No profile found</p>;

  return (
    <>
     <h1 className="text-4xl font-bold mt-10 mb-6 text-foreground">
        {t("resident.YourProfile")}
      </h1>

      {/* Subtitle / Hint */}
      <p className="text-muted-foreground mb-10">
        {t("resident.manage")}
      </p>
    <div className="max-w-4xl mx-auto mt-10 bg-background border border-border shadow-md rounded-xl p-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        
        {/* IMAGE */}
        <img 
          src={import.meta.env.VITE_USER_IMAGE + data.image} 
          alt="Doctor" 
          className="w-32 h-32 rounded-full object-cover border border-border shadow-sm"
        />

        {/* BASIC INFO */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-primary">{data.fullName}</h2>
          <p className="text-foreground mt-1 text-lg">{data.specializationName}</p>

          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => setOpenEdit(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all"
            >
              <FaEdit /> {t("resident.edit")}
            </button>

            <button 
              onClick={() => setOpenPass(true)}
              className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-secondary/80 transition-all"
            >
              <FaLock /> {t("resident.change")}
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-border"></div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        <ProfileItem title={t("login.Email")} value={data.email} />
        <ProfileItem title={t("profile.doctor.Phone")} value={data.phone} />
        <ProfileItem title={t("profile.doctor.University")} value={data.universityName} />
        <ProfileItem title={t("profile.doctor.Graduation")} value={data.graduationYear} />
        <ProfileItem title={t("profile.doctor.Experience")} value={`${data.experienceYears} Years`} />
        <ProfileItem title={t("profile.doctor.Birthday")} value={data.birthDay?.split("T")[0]} />

        <div className="md:col-span-2">
          <ProfileItem title={t("doctor.Bio")} value={data.description} />
        </div>

      </div>

      {/* CV Download */}
      {data.cv && (
        <div className="mt-6">
          <a 
            href={import.meta.env.VITE_DOCTOR_CV + data.cv}
            target="_blank"
            className="text-primary underline font-medium"
          >
            {t("doctor.downCV")}
          </a>
        </div>
      )}

      {/* Edit Modal */}
      {data && (
        <EditDoctorProfileModal
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          fullname={data.fullName}
          phoneNumber={data.phone}
          userId={id}
        />
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={openPass}
        onClose={() => setOpenPass(false)}
      />
    </div>
    </>
  );
}

/* Small reusable component */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProfileItem({ title, value }: { title: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-lg font-semibold">{value ?? "—"}</span>
    </div>
  );
  
}
