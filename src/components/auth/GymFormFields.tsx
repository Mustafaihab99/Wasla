import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCompleteGym from "../../hooks/completeProfile/useCompleteGym";
import { FaCamera, FaTrash, FaPlus } from "react-icons/fa";

export default function GymFormFields({ email }: { email: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: completeGym, isPending } = useCompleteGym();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const initialValues = {
    Email: email || "",
    businessName: "",
    ownerName: "",
    description: "",
    phones: [""],
    photo: null as File | null,
    photos: [] as File[],
  };

  const validationSchema = Yup.object({
    businessName: Yup.string()
      .min(3, t("profile.gym.businessMin"))
      .required(t("profile.gym.businessReq")),

    ownerName: Yup.string()
      .min(3, t("profile.gym.ownerMin"))
      .required(t("profile.gym.ownerReq")),

    description: Yup.string()
      .min(10, t("profile.gym.descMin"))
      .required(t("profile.gym.descReq")),

    phones: Yup.array()
      .of(
        Yup.string()
          .matches(/^01[0-2,5]{1}[0-9]{8}$/, t("profile.gym.phoneInvalid"))
          .min(11 , t("profile.gym.phoneInvalid"))
          .required(t("profile.gym.phoneReq"))
      )
      .min(1, t("profile.gym.phoneAtLeast")),

    photo: Yup.mixed().required(t("profile.gym.photoReq")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const formData = new FormData();

    formData.append("gmail", values.Email);
    formData.append("businessName", values.businessName);
    formData.append("ownerName", values.ownerName);
    formData.append("description", values.description);
    formData.append("latitude", "0");
    formData.append("longitude", "0");

    values.phones.forEach((phone, index) => {
      formData.append(`phones[${index}]`, phone);
    });

    if (values.photo) formData.append("photo", values.photo);

    values.photos.forEach((file) => {
      formData.append("photos", file);
    });

    await completeGym(formData);
    navigate("/auth/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Hidden Email */}
            <Field type="hidden" name="Email" value={email} />

            {/* Main Image */}
            <div className="flex flex-col items-center mb-5 lg:col-span-2">
              <label className="cursor-pointer relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-muted">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-gray-400 w-10 h-10 group-hover:text-primary transition-all" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("photo", file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              <ErrorMessage
                name="photo"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Business Name */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.gym.businessName")}
              </label>
              <Field
                name="businessName"
                placeholder={t("profile.gym.businessPlaceholder")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="businessName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Owner Name */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.gym.ownerName")}
              </label>
              <Field
                name="ownerName"
                placeholder={t("profile.gym.ownerPlaceholder")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="ownerName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Description */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.gym.description")}
              </label>
              <Field
                as="textarea"
                name="description"
                rows={3}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Phones */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.gym.phones")}
              </label>

              <FieldArray name="phones">
                {({ push, remove }) => (
                  <>
                    {values.phones.map((_, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Field
                          name={`phones[${index}]`}
                          placeholder="01012345678"
                          className="flex-1 p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        {values.phones.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => remove(index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center gap-1 text-primary text-sm"
                      onClick={() => push("")}
                    >
                      <FaPlus />
                      {t("profile.gym.addPhone")}
                    </button>
                  </>
                )}
              </FieldArray>
              
              <ErrorMessage
                name="phones"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Gallery */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.gym.gallery")}
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.currentTarget.files || []);
                  const newFiles = [...values.photos, ...files];

                  setFieldValue("photos", newFiles);
                  setGalleryPreview(newFiles.map((f) => URL.createObjectURL(f)));
                }}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />

              <div className="flex gap-2 mt-3 flex-wrap">
                {galleryPreview.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => {
                        const updatedFiles = values.photos.filter((_, i) => i !== index);
                        setFieldValue("photos", updatedFiles);
                        setGalleryPreview(updatedFiles.map((f) => URL.createObjectURL(f)));
                      }}
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                {isPending
                  ? t("profile.gym.saving")
                  : t("profile.gym.save")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
