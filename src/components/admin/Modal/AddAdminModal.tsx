import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

export default function AddAdminModal({ isOpen, onClose, onSubmit }: Props) {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      gender: "M",
      phone: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, t("admin.validation.nameMin"))
        .required(t("admin.validation.required")),

      email: Yup.string()
        .email(t("admin.validation.email"))
        .required(t("admin.validation.required")),

      phone: Yup.string()
        .matches(/^[0-9]{10,15}$/, t("admin.validation.phone"))
        .required(t("admin.validation.required")),

      password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
      t("login.passregex")
    )
        .min(6, t("admin.validation.passwordMin"))
        .required(t("admin.validation.required")),
    }),

   onSubmit: (values) => {
 onSubmit({
  ...values,
  gender: values.gender === "male" ? "M" : "F",
});

  onClose();
  formik.resetForm();
},
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        style={{marginTop:"0"}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={formik.handleSubmit}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="bg-background border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-center">
            {t("admin.addAdmin")}
          </h2>

          {/* Full Name */}
          <div>
            <input
              name="fullName"
              placeholder={t("admin.fullName")}
              className="input w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder={t("admin.Email")}
              className="input w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              placeholder={t("admin.phone")}
              className="input w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder={t("admin.password")}
              className="input w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border"
            >
              {t("doctor.Cancel")}
            </button>

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="flex-1 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              {t("admin.create")}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}