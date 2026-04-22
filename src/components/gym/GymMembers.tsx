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
        <h2 className="text-xl sm:text-2xl font-bold ml-4 mr-4">
          {t("gym.membersByService")}
        </h2>
      </div>

      {data?.length === 0 ? (
        <div className="flex justify-center mt-10">
          <img src={noData} className="w-56 sm:w-72 opacity-80" />
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">

          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-12 bg-muted/40 px-4 py-3 text-sm font-semibold border-b">
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
      {/* Wrapper */}
      <div className="border-b">

        {/* ✅ Mobile Card */}
        <div className="md:hidden p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={import.meta.env.VITE_GYM_IMAGE + service.photoUrl}
              className="w-12 h-12 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold text-sm">
                {isArabic ? service.name.arabic : service.name.english}
              </p>

              <p className="text-xs text-muted-foreground">
                {service.durationInMonths} {t("gym.mo")}
              </p>
            </div>

            <button onClick={toggle}>
              <FaChevronDown
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <span>
              💰 {service.newPrice || service.price} {t("doctor.EGP")}
            </span>

            <span className="flex items-center gap-1">
              <FaUsers />
              {members ? members.length : "-"}
            </span>
          </div>
        </div>

        {/* ✅ Desktop Row */}
        <div className="hidden md:grid grid-cols-12 items-center px-4 py-4 hover:bg-muted/20 transition">
          <div className="col-span-5 flex items-center gap-3">
            <img
              src={import.meta.env.VITE_GYM_IMAGE + service.photoUrl}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <p className="font-semibold">
              {isArabic ? service.name.arabic : service.name.english}
            </p>
          </div>

          <div className="col-span-2 font-medium">
            {service.newPrice || service.price} {t("doctor.EGP")}
          </div>

          <div className="col-span-2">
            {service.durationInMonths} {t("gym.mo")}
          </div>

          <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FaUsers />
            {members ? members.length : "-"}
          </div>

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
    <div className="p-4 md:px-6 md:py-3 text-sm">

      {/* ✅ Mobile */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center gap-3">
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

        <div className="text-muted-foreground text-xs">
          📧 {member.email}
        </div>

        <div className="text-muted-foreground text-xs">
          📞 {member.phone}
        </div>
      </div>

      {/* ✅ Desktop */}
      <div className="hidden md:grid grid-cols-12 items-center">
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
    </div>
  );
}