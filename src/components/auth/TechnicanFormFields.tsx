import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useSetTechnicanProfile from "../../hooks/completeProfile/useSetTechnicanProfile";
import useGetTechnicanSpecial from "../../hooks/technican/useGetTechnicanSpecial";
import { FaCamera } from "react-icons/fa";

export default function TechnicianFormFields({ email }: { email: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [docName, setDocName] = useState<string[]>([]);
  const { mutateAsync: completeTechnician, isPending } =
    useSetTechnicanProfile();
  const { data: specializations, isLoading } = useGetTechnicanSpecial();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [fieldValues] = useState({
    Email: email || "",
    FullName: "",
    SpecializationId: 0,
    BirthDay: "",
    Phone: "",
    Description: "",
    Photo: null,
    Documents: [] as File[],
  });

  const validationSchema = Yup.object({
    FullName: Yup.string().required(t("profile.tech.namereq")),

    SpecializationId: Yup.number().required(t("profile.tech.spireq")),

    BirthDay: Yup.date()
      .required(t("profile.tech.birthreq"))
      .max(new Date(), t("profile.tech.birthFuture")),

    Phone: Yup.string()
      .min(11, t("profile.tech.phonemin"))
      .max(11, t("profile.tech.phonemin"))
      .required(t("profile.tech.phonereq")),

    Description: Yup.string().required(t("profile.tech.descreq")),

    Photo: Yup.mixed().required(t("profile.tech.photoreq")),
   
    Documents: Yup.array()
  .min(1, t("profile.tech.docsreq"))
  .max(3, t("profile.tech.maxFiles"))
  .required(t("profile.tech.docsreq")),
  });

  const handleSubmit = async (values: typeof fieldValues) => {
    try {
      const formData = new FormData();

      formData.append("Email", values.Email || "");
      formData.append("FullName", values.FullName || "");
      formData.append(
        "SpecializationId",
        String(values.SpecializationId || ""),
      );
      formData.append("BirthDay", values.BirthDay || "");
      formData.append("Phone", values.Phone || "");
      formData.append("Description", values.Description || "");

      if (values.Photo) formData.append("Photo", values.Photo);
     if (values.Documents && values.Documents.length > 0) {
  values.Documents.forEach((file: File) => {
    formData.append("Documents", file);
  });
}

      await completeTechnician(formData);
      navigate("/auth/login");
    } catch (error) {
      toast.error(t("profile.tech.failed"));
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
            {/* Photo */}
            <div className="flex flex-col items-center mb-6 lg:col-span-2">
              <label
                htmlFor="photo-upload"
                className="cursor-pointer group relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-background shadow-md">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-foreground/50 w-10 h-10 group-hover:text-primary transition" />
                  )}
                </div>

                <div className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                  {t("profile.tech.upload")}
                </div>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("Photo", file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>

              <ErrorMessage
                name="Photo"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>

            {/* Input Style */}
            {/** reusable classes */}
            {/** input */}
            {/** focus ring + smooth */}

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <Field type="hidden" name="Email" value={email} />
              <label className="text-sm font-medium text-foreground">
                {t("profile.tech.name")}
              </label>
              <Field
                name="FullName"
                placeholder={t("profile.tech.entername")}
                className="p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <ErrorMessage
                name="FullName"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                {t("profile.tech.specialization")}
              </label>
              <Field
                as="select"
                name="SpecializationId"
                className="p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition">
                <option value="">{t("profile.tech.select")}</option>
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
                className="text-red-500 text-xs"
              />
            </div>

            {/* BirthDay */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                {t("profile.tech.birthday")}
              </label>
              <Field
                type="date"
                name="BirthDay"
                className="p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <ErrorMessage
                name="BirthDay"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                {t("profile.tech.phone")}
              </label>
              <Field
                name="Phone"
                placeholder="01012345678"
                className="p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <ErrorMessage
                name="Phone"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 lg:col-span-2">
              <label className="text-sm font-medium text-foreground">
                {t("profile.tech.description")}
              </label>
              <Field
                as="textarea"
                name="Description"
                rows={4}
                placeholder={t("profile.tech.describePlaceholder")}
                className="p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              />
              <ErrorMessage
                name="Description"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Documents */}
            {/* Documents */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-sm font-medium text-foreground">
                {t("profile.tech.documents")}
              </label>

              <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition bg-background text-foreground">
                {docName.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {docName.map((name, i) => (
                      <div key={i} className="text-primary text-sm font-medium">
                        ✅ {name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>📄 {t("profile.tech.uploadDocs")}</span>
                )}

                <input
  type="file"
  multiple
  className="hidden"
  onChange={(e) => {
    const files = e.currentTarget.files;
    if (files) {
      const filesArray = Array.from(files);

      if (filesArray.length > 3) {
        toast.error(t("profile.tech.maxFiles"));
        return;
      }

      setFieldValue("Documents", filesArray);
      setDocName(filesArray.map((f) => f.name));
    }
  }}
/>
              </label>

              {docName.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setDocName([]);
                    setFieldValue("Documents", []);
                  }}
                  className="text-sm text-red-500 hover:underline w-fit">
                  {t("profile.tech.removeFile")}
                </button>
              )}

              <ErrorMessage
                name="Documents"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Submit */}
            <div className="lg:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
                {isPending ? t("profile.Saving...") : t("profile.tech.save")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
