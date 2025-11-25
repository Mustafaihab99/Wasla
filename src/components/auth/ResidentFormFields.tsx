import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCompleteResidentProfile from "../../hooks/completeProfile/useResidentProfile";
import { FaCamera } from "react-icons/fa";

export default function ResidentFormFields({ email }: { email: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: completeResident, isPending } = useCompleteResidentProfile();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [fieldValues] = useState({
    Email: email || "",
    FullName: "",
    NationalId: "",
    Image: null,
    BirthDay: "",
    Phone: "",
  });

  const validationSchema = Yup.object({
    FullName: Yup.string().required(t("profile.doctor.namereq")),
    NationalId: Yup.string().min(14 , t("profile.resident.natmin"))
      .required(t("profile.resident.nationalreq"))
      .matches(/^\d+$/, t("profile.resident.nationalnum")),
    BirthDay: Yup.string().required(t("profile.doctor.birthreq")),
    Phone: Yup.string().min(11,t("profile.doctor.phonemin")).max(11,t("profile.doctor.phonemin")).required(t("profile.doctor.phonereq")),
    Image: Yup.mixed().required(t("profile.doctor.imgreq")),
  });

  const handleSubmit = async (values: typeof fieldValues) => {
    try {
      const formData = new FormData();
      formData.append("Email", values.Email || "");
      formData.append("FullName", values.FullName || "");
      formData.append("NationalId", values.NationalId || "");
      formData.append("BirthDay", values.BirthDay || "");
      formData.append("Phone", values.Phone || "");
      if (values.Image) formData.append("Image", values.Image);

      await completeResident(formData);
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Formik
        enableReinitialize
        initialValues={fieldValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-5 lg:col-span-2">
              <label htmlFor="image-upload" className="cursor-pointer relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-muted">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-gray-400 w-10 h-10 group-hover:text-primary transition-all" />
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("Image", file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
              <ErrorMessage
                name="Image"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Full Name */}
            <div className="flex flex-col">
              <Field type="hidden" name="Email" value={email} />
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.name")}
              </label>
              <Field
                name="FullName"
                placeholder={t("profile.doctor.entername")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="FullName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* National ID */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.resident.national")}
              </label>
              <Field
                name="NationalId"
                placeholder={t("profile.resident.enternational")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="NationalId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* BirthDay */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.Birthday")}
              </label>
              <Field
                type="date"
                name="BirthDay"
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="BirthDay"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.Phone")}
              </label>
              <Field
                name="Phone"
                placeholder="01012345678"
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="Phone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                {isPending
                  ? t("profile.Saving...")
                  : t("profile.resident.saveResident")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
