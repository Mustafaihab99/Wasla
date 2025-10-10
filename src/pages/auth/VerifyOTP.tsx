import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const {t} = useTranslation();
  const initialValues = { otp: "" };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, t("login.otplen"))
      .required(t("login.OTP is required")),
  });

  const handleSubmit = async (values: { otp: string; }) => {
    console.log("Verify OTP:", values.otp);
      navigate("/auth/reset-password", { state: { email } });
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("login.Verify OTP")}
      </h2>
      <p className="text-sm text-center text-muted mb-10">
        {t("login.please")} <span className="font-semibold">{email}</span>
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
                name="otp"
                type="text"
                placeholder={t("login.Enter OTP")}
                maxLength={6}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest text-lg bg-background text-foreground"
              />
              <ErrorMessage
                name="otp"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isSubmitting ? t("login.Verifying...") : t("login.Verify OTP")}
            </button>

            <p className="text-center text-sm text-primary cursor-pointer hover:underline">
              {t("login.Resend Code")}
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
