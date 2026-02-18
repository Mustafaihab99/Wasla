import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaPhone, FaEnvelope, FaUsers } from "react-icons/fa";
import useGetGymService from "../../hooks/gym/useGetGymService";
import useGetGymMembersService from "../../hooks/gym/useGetGymMembersService";
import { gymServiceData, memberData } from "../../types/gym/gym-types";
import i18next from "i18next";
import noData from "../../assets/images/nodata.webp";
import GymProfileSkeleton from "./GymProfileSkeleton";
import { useTranslation } from "react-i18next";

export default function GymMembersPage() {
  const serviceProviderId = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetGymService(serviceProviderId);
  const { t } = useTranslation();

  const [openServiceId, setOpenServiceId] = useState<number | null>(null);
  const isArabic = i18next.language === "ar";

  if (isLoading) return <GymProfileSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("gym.membersByService")}</h2>
      </div>

      {data?.length === 0 ? (
        <div className="flex justify-center mt-10">
          <img src={noData} className="w-72 opacity-80" />
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <div className="grid grid-cols-12 bg-muted/40 px-4 py-3 text-sm font-semibold border-b">
            <div className="col-span-5">{t("gym.service")}</div>
            <div className="col-span-2">{t("doctor.EGP")}</div>
            <div className="col-span-2">{t("gym.duration")}</div>
            <div className="col-span-2">{t("gym.members")}</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {data?.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              isOpen={openServiceId === service.id}
              toggle={() =>
                setOpenServiceId(
                  openServiceId === service.id ? null : service.id
                )
              }
              isArabic={isArabic}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceRow({
  service,
  isOpen,
  toggle,
  isArabic,
}: {
  service: gymServiceData;
  isOpen: boolean;
  toggle: () => void;
  isArabic: boolean;
}) {
  const { t } = useTranslation();

  const { data: members, isFetching } = useGetGymMembersService(
    service.id.toString(),
    {
      enabled: isOpen,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  );

  return (
    <>
      {/* Main Row */}
      <div className="grid grid-cols-12 items-center px-4 py-4 border-b hover:bg-muted/20 transition">
        <div className="col-span-5 flex items-center gap-3">
          <img
            src={import.meta.env.VITE_GYM_IMAGE + service.photoUrl}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">
              {isArabic ? service.name.arabic : service.name.english}
            </p>
          </div>
        </div>

        <div className="col-span-2 font-medium">
          {service.newPrice || service.price} {t("doctor.EGP")}
        </div>

        {/* Duration */}
        <div className="col-span-2">
          {service.durationInMonths} {t("gym.mo")}
        </div>

        {/* Members Count */}
        <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
          <FaUsers />
          {members ? members.length : "-"}
        </div>

        {/* Toggle */}
        <div className="col-span-1 text-right">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-primary/10 transition"
          >
            <FaChevronDown
              className={`transition ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Members Expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-muted/10 border-b"
          >
            {isFetching ? (
              <p className="p-4 text-sm">{t("gym.loading")}</p>
            ) : members?.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                {t("gym.noMembers")}
              </p>
            ) : (
              <div className="divide-y">
                {members?.map((member, index) => (
                  <MemberRow key={index} member={member} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MemberRow({ member }: { member: memberData }) {
  return (
    <div className="grid grid-cols-12 items-center px-6 py-3 text-sm">
      <div className="col-span-5 flex items-center gap-3">
        <img
          src={
            member.image
              ? import.meta.env.VITE_USER_IMAGE + member.image
              : "/avatar.png"
          }
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="font-medium">{member.name}</span>
      </div>

      <div className="col-span-4 flex items-center gap-2 text-muted-foreground">
        <FaEnvelope />
        {member.email}
      </div>

      <div className="col-span-3 flex items-center gap-2 text-muted-foreground">
        <FaPhone />
        {member.phone}
      </div>
    </div>
  );
}
