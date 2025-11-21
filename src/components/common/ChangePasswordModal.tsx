import Modal from "./Modal";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import useChangePassword from "../../hooks/auth/useChangePassword";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  email
}: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const changePassMutation = useChangePassword();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("login.Invalid email"))
      .required(t("login.Email is required")),
    currentPassword: Yup.string()
      .min(8, t("login.least"))
      .required(t("login.Password is required")),
    newPassword: Yup.string()
      .min(8, t("login.least"))
      .required(t("login.Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("login.passwordsMustMatch"))
      .required(t("login.Confirm password is required")),
  });

  const formik = useFormik({
    initialValues: {
      email: email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { email, currentPassword, newPassword } = values;
      changePassMutation.mutate(
        { email, currentPassword, newPassword },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-2xl font-bold mb-6 text-center">{t("resident.change")}</h3>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-1 block">{t("login.Email")}</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Current Password */}
        <div>
          <label className="text-sm font-medium mb-1 block">{t("resident.oldPassword")}</label>
          <input
            type="password"
            name="currentPassword"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm font-medium mb-1 block">{t("resident.newPassword")}</label>
          <input
            type="password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium mb-1 block">{t("login.confirm")}</label>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={changePassMutation.isPaused}
          className="mt-4 bg-primary text-white py-3 rounded-lg w-full font-semibold disabled:opacity-50"
        >
          {changePassMutation.isPending ? t("profile.Saving...") : t("resident.save")}
        </button>
      </form>
    </Modal>
  );
}
