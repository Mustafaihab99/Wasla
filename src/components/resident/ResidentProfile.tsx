import { useState } from "react";
import useGetResidentProfile from "../../hooks/resident/useGetResidentProfile";
import EditProfileModal from "../common/EditProfileModal";
import ChangePasswordModal from "../common/ChangePasswordModal";
import { useTranslation } from "react-i18next";

export default function ResidentProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetResidentProfile(id);
  const {t} = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mt-10 mb-6 text-foreground">
        {t("resident.YourProfile")}
      </h1>

      {/* Subtitle / Hint */}
      <p className="text-muted-foreground text-center mb-10">
        {t("resident.manage")}
      </p>

      {/* Card */}
      <div className="bg-background border border-border rounded-2xl p-8 w-full max-w-xl flex flex-col items-center space-y-6">
        {/* Profile Image */}
        {isLoading ? (
          <div className="w-36 h-36 rounded-full bg-gray-300 animate-pulse mb-6"></div>
        ) : (
          <img
            src={import.meta.env.VITE_USER_IMAGE + data?.imageUrl}
            alt="profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-md mb-6"
          />
        )}

        {/* Info */}
        {isLoading ? (
          <div className="space-y-2 w-3/4">
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center">{data?.fullname}</h2>
            <p className="text-muted-foreground text-center mt-2">{data?.email}</p>
            <p className="text-muted-foreground text-center">{data?.phoneNumber}</p>
          </>
        )}

        {/* Buttons */}
        {!isLoading && (
          <div className="flex flex-col gap-4 w-full mt-6">
            <button
              onClick={() => setOpenEdit(true)}
              className="py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition">
              {t("resident.edit")}
            </button>

            <button
              onClick={() => setOpenPass(true)}
              className="py-3 rounded-lg border border-border hover:bg-primary/10 transition font-semibold">
              {t("resident.change")}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {data && (
        <EditProfileModal
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          fullname={data.fullname}
          phoneNumber={data.phoneNumber}
        />
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={openPass}
        onClose={() => setOpenPass(false)}
      />
    </div>
  );
}
