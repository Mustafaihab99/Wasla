import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useLogin from "../../hooks/auth/useLogin";
import { toast } from "sonner";

export default function Login() {
  const { t } = useTranslation();
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("login.Invalid email"))
      .required(t("login.Email is required")),
    password: Yup.string()
      .min(8, t("login.least"))
      .required(t("login.Password is required")),
  });

  const handleSubmit = async (
  values: typeof initialValues,
  { setSubmitting }: FormikHelpers<typeof initialValues>
) => {
  try {
    const res = await login(values); 
    const data = res.data.data;

    const { isVerfied, isCompletedRegister, statue, role } = data;

    //Not Verified
    if (!isVerfied) {
      return navigate("/auth/verify-email", {
        state: { email: values.email , role}
      });
    }

    //Verified but !completed
    if (!isCompletedRegister) {
      return navigate("/auth/complete-profile", {
        state: { email: values.email, role }
      });
    }

    // check statue
    switch (statue) {
      case 0:
        // success login
        toast.success(t("login.Logged in successfully!"));
        sessionStorage.setItem("auth_token", data.token);
        sessionStorage.setItem("role", role);
        return navigate("/dashboard");

      case 1:
        return toast.error(t("login.Your account is suspended."));

      case 2:
        return toast.error(t("login.Your account is not approved yet."));

      case 3:
        return toast.error(t("login.Your account has been deleted."));
    }
  } catch (error) {
    console.error("Login failed", error);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <motion.div
      className="w-full max-w-lg mx-auto p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-semibold mb-10 text-foreground">
        {t("login.log")}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium mb-1 text-foreground">
                {t("login.Email")}
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder={t("login.enter")}
                className="p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="font-medium mb-1 text-foreground">
                {t("login.Password")}
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder={t("login.enterpass")}
                className="p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-primary hover:underline text-sm font-medium"
              >
                {t("login.forget")}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isPending ? t("login.Logging in...") : t("login.Login")}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">{t("login.or")}</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Go to Register */}
            <p className="text-center text-sm text-muted-foreground mt-2">
              {t("login.dont")}
              <Link to="/auth/signup" className="text-primary hover:underline font-medium">
                {t("login.Sign up")}
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
