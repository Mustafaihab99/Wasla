import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useRoles from "../../hooks/auth/useRoles";
import useSignUp from "../../hooks/auth/useSignUp";
import type { signData } from "../../types/auth/authData";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: signup, isPending: mutationLoading } = useSignUp();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  };

  const { data } = useRoles();
  const roles = data?.data ?? [];
const validationSchema = Yup.object({
  email: Yup.string()
    .email(t("login.Invalid email"))
    .required(t("login.Email is required")),
    
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      t("login.passregex")
    )
    .required(t("login.Password is required")),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], t("login.passwordsMustMatch"))
    .required(t("login.Confirm password is required")),

  role: Yup.string().required(t("login.rolereq")),
});


  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await signup(values as signData);
      navigate("/auth/verify-email", { state: { email: values.email } });
    } catch (err) {
      console.error("Signup failed:", err);
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
        {t("login.sign")}
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
                autoComplete="username"
                className="p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
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
                autoComplete="new-password"
                className="p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="font-medium mb-1 text-foreground">
                {t("login.confirm")}
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                placeholder={t("login.enterconf")}
                className="p-3 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Role Selection */}
            <div className="flex flex-col">
              <label htmlFor="role" className="font-medium mb-1 text-foreground">
                {t("login.role")}
              </label>
              <Field
                as="select"
                name="role"
                id="role"
                className="p-3 border border-primary rounded-lg bg-background text-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">{t("login.chooseRole")}</option>
                {roles.map((role: string) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || mutationLoading}
              className="bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isSubmitting || mutationLoading ? t("login.Signing in...") : t("login.SignUp")}
            </button>

            {/* Go to Login */}
            <p className="text-center text-sm text-muted-foreground mt-2">
              {t("login.have")}{" "}
              <Link to="/auth/login" className="text-primary hover:underline font-medium">
                {t("login.Login")}
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
