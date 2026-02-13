import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import useGetGymService from "../../hooks/gym/useGetGymService";
import useAddGymService from "../../hooks/gym/useAddGymService";
import useUpdateGymService from "../../hooks/gym/useUpdateGymService";
import useDeleteGymService from "../../hooks/gym/useDeleteGymService";
import { gymServiceData } from "../../types/gym/gym-types";
import i18next from "i18next";
import noData from "../../assets/images/nodata.webp";
import { ConfirmDelete } from "./Modal/GymConfirmDelete";
import { ServiceModal } from "./Modal/GymServiceModal";
import GymProfileSkeleton from "./GymProfileSkeleton";
import { useTranslation } from "react-i18next";

export default function GymServicesPage() {
  const serviceProviderId = sessionStorage.getItem("user_id")!;

  const { data, isLoading } = useGetGymService(serviceProviderId);
  const { mutate: addService, isPending: adding } = useAddGymService();
  const { mutate: updateService, isPending: updating } = useUpdateGymService();
  const { mutate: deleteService } = useDeleteGymService();
  const {t} = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<gymServiceData | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const isArabic = i18next.language === "ar";

  const openAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const openEdit = (service: gymServiceData) => {
    setEditData(service);
    setOpenModal(true);
  };

  if (isLoading) return <GymProfileSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("gym.gymserv")}</h2>

        <button
          onClick={openAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition">
          <FaPlus /> {t("gym.add")}
        </button>
      </div>
      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.length === 0 ? (
          <div className="flex justify-center mt-10 col-span-full">
            <img src={noData} alt="no data found" className="w-72 opacity-80" />
          </div>
        ) : (
          data?.map((service) => {
            const hasOffer =
              service.type === 2 &&
              service.newPrice &&
              service.newPrice < service.price;
            const savedAmount = hasOffer ? service.price - service.newPrice : 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="
            relative overflow-hidden
            rounded-2xl border border-border
            bg-gradient-to-br from-background to-muted/40
            shadow-md hover:shadow-2xl
            transition-all duration-300
            group
          ">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={import.meta.env.VITE_GYM_IMAGE + service.photoUrl}
                    alt={isArabic ? service.name.arabic : service.name.english}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    {hasOffer ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white shadow flex items-center gap-1">
                        🔥 {service.precentage}% OFF
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white shadow">
                        {t("gym.Package")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                    {isArabic ? service.name.arabic : service.name.english}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {isArabic
                      ? service.description.arabic
                      : service.description.english}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      {hasOffer ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {service.newPrice} {t("doctor.EGP")}
                            </span>
                            <span className="text-sm line-through text-muted-foreground">
                              {service.price}
                            </span>
                          </div>

                          <span className="text-[11px] text-green-600 font-medium">
                            {t("gym.Save")} {savedAmount} {t("doctor.EGP")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {service.price} {t("doctor.EGP")}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {service.durationInMonths} {t("gym.mo")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-3 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEdit(service)}
                      className="
                  w-9 h-9 flex items-center justify-center
                  rounded-lg bg-blue-500/10 text-blue-500
                  hover:bg-blue-500 hover:text-white
                  transition
                ">
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => setDeleteId(service.id)}
                      className="
                  w-9 h-9 flex items-center justify-center
                  rounded-lg bg-red-500/10 text-red-500
                  hover:bg-red-500 hover:text-white
                  transition
                ">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <div className="absolute inset-0 bg-primary/10 blur-xl" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <ServiceModal
            onClose={() => setOpenModal(false)}
            serviceProviderId={serviceProviderId}
            editData={editData}
            loading={adding || updating}
            onSubmit={(formData: FormData) => {
              if (editData) updateService(formData);
              else addService(formData);
              setOpenModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <ConfirmDelete
            onClose={() => setDeleteId(null)}
            onConfirm={() => {
              deleteService(deleteId);
              setDeleteId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
