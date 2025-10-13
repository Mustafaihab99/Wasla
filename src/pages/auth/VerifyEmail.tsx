import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useVerifyEmail from "../../hooks/auth/useVerifyEmail";
import useResendCode from "../../hooks/auth/useResendCode";

export default function VerifyEmail() {
  const location = useLocation();
  // const navigate = useNavigate();
  const email = location.state?.email;
  const { t } = useTranslation();

  const { mutateAsync: verifyEmail, isPending } = useVerifyEmail();
  const {mutateAsync: resendcode , isPending: isLoading} = useResendCode();

  const initialValues = { 
    verificationCode: "",
  };

  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .length(4, t("login.otplen"))
      .required(t("login.OTP is required")),
  });

  const handleSubmit = async (values: { verificationCode: string }) => {
    try {
      const payload = { email, verificationCode: values.verificationCode };
      await verifyEmail(payload, {
        onSuccess: () => {
          // navigate("/auth/login");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  async function handleResend(){
    const payload = {email};
    await resendcode(payload);
  }
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
                name="verificationCode"
                type="text"
                placeholder={t("login.Enter OTP")}
                maxLength={6}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest text-lg bg-background text-foreground"
              />
              <ErrorMessage
                name="verificationCode"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isPending ? t("login.Verifying...") : t("login.Verify OTP")}
            </button>

            <p className="text-center text-sm text-primary cursor-pointer hover:underline"
            onClick={handleResend}
            >
              {!isLoading ? t("login.Resend Code") : t("login.Sending...")}
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
