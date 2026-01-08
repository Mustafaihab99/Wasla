import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCompleteDoctorProfile from "../../hooks/completeProfile/useDoctorProfile";
import useSpecializations from "../../hooks/completeProfile/useDoctorSpecialized";
import { FaCamera } from "react-icons/fa";

export default function DoctorFormFields({ email }: { email: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: completeDoctor, isPending } = useCompleteDoctorProfile();
  const { data: specializations, isLoading } = useSpecializations();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [fieldValues] = useState({
    Email: email || "",
    FullName: "",
    SpecializationId: 0,
    ExperienceYears: "",
    UniversityName: "",
    hospitalName: "",
    GraduationYear: "",
    BirthDay: "",
    Phone: "",
    Description: "",
    Image: null,
    CV: null,
  });

  const validationSchema = Yup.object({
    FullName: Yup.string().required(t("profile.doctor.namereq")),
    SpecializationId: Yup.number().required(t("profile.doctor.spireq")),
    ExperienceYears: Yup.number()
      .min(0, t("profile.doctor.year"))
      .required(t("profile.doctor.exreq")),
    UniversityName: Yup.string().required(t("profile.doctor.unireq")),
    hospitalName: Yup.string().required(t("profile.doctor.hosreq")),
    GraduationYear: Yup.number()
      .required(t("profile.doctor.gradreq"))
      .min(1950)
      .max(new Date().getFullYear()),
    BirthDay: Yup.date()
      .required(t("profile.doctor.birthreq"))
      .max(new Date(), t("profile.doctor.birthFuture"))
      .min(
        new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
        t("profile.doctor.birthFuture")
      ),
    Phone: Yup.string()
      .min(11, t("profile.doctor.phonemin"))
      .max(11, t("profile.doctor.phonemin"))
      .required(t("profile.doctor.phonereq")),
    Description: Yup.string().required(t("profile.doctor.descreq")),
    Image: Yup.mixed().required(t("profile.doctor.imgreq")),
    CV: Yup.mixed().required(t("profile.doctor.cvreq")),
  });

  const handleSubmit = async (values: typeof fieldValues) => {
    try {
      const formData = new FormData();
      formData.append("Email", values.Email || "");
      formData.append("FullName", values.FullName || "");
      formData.append(
        "SpecializationId",
        String(values.SpecializationId || "")
      );
      formData.append("ExperienceYears", String(values.ExperienceYears || ""));
      formData.append("UniversityName", values.UniversityName || "");
      formData.append("hospitalName", values.hospitalName || "");
      formData.append("GraduationYear", String(values.GraduationYear || ""));
      formData.append("BirthDay", values.BirthDay || "");
      formData.append("Phone", values.Phone || "");
      formData.append("Description", values.Description || "");

      if (values.Image) formData.append("Image", values.Image);
      if (values.CV) formData.append("CV", values.CV);

      await completeDoctor(formData);
      navigate("/auth/login");
    } catch (error) {
      toast.error(t("Failed to complete doctor profile"));
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}>
      <Formik
        enableReinitialize
        initialValues={fieldValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-5 lg:col-span-2">
              <label
                htmlFor="image-upload"
                className="cursor-pointer relative group">
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

            {/* Specialization */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.Specialization")}
              </label>
              <Field
                as="select"
                name="SpecializationId"
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground">
                <option value="">{t("profile.doctor.selectspi")}</option>
                {!isLoading &&
                  specializations?.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="SpecializationId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Experience Years */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.Experience")}
              </label>
              <Field
                type="number"
                name="ExperienceYears"
                placeholder="5"
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="ExperienceYears"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* University */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.University")}
              </label>
              <Field
                name="UniversityName"
                placeholder={t("profile.doctor.enteruni")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="UniversityName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* hospiyal */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.hos")}
              </label>
              <Field
                name="hospitalName"
                placeholder={t("profile.doctor.enterhos")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="hospitalName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Graduation Year */}
            <div className="flex flex-col">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.Graduation")}
              </label>
              <Field
                type="number"
                name="GraduationYear"
                placeholder="2020"
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="GraduationYear"
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
            {/* Description */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.Description")}
              </label>
              <Field
                as="textarea"
                name="Description"
                rows={3}
                placeholder={t("profile.doctor.descripe")}
                className="w-full p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="Description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* CV Upload */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1 text-foreground">
                {t("profile.doctor.uploadcv")}
              </label>
              <input
                type="file"
                name="CV"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFieldValue("CV", e.currentTarget.files?.[0])
                }
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
              <ErrorMessage
                name="CV"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                {isPending
                  ? t("profile.Saving...")
                  : t("profile.doctor.saveDoc")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
