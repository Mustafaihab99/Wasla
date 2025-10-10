import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { t } = useTranslation();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, t("login.passwordMin"))
      .required(t("login.Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], t("login.passwordsMustMatch"))
      .required(t("login.Confirm password is required")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("Reset Password for:", email, "with new password:", values.password);
    navigate("/auth/login");
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("login.Reset Password")}
      </h2>
      <p className="text-sm text-muted mb-10">
        {t("login.resetFor")} <span className="font-semibold">{email}</span>
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="password"
                type="password"
                placeholder={t("login.New Password")}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="confirmPassword"
                type="password"
                placeholder={t("login.Confirm New Password")}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isSubmitting
                ? t("login.Resetting...")
                : t("login.Reset Password")}
            </button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
