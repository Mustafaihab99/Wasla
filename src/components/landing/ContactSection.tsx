import { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useAddContactUs from "../../hooks/resident/useAddContactUs";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { t } = useTranslation();
  const {mutateAsync: sendMessage , isPending} = useAddContactUs();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await sendMessage({
      fullName: form.name,
      email: form.email,
      message: form.message,
    });

    toast.success(t("landing.soon"));
    setForm({ name: "", email: "", message: "" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error(t("landing.error"));
  }
};

  return (
    <SectionWrapper id="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto">
         
        <h3 className="text-3xl font-bold text-center mb-2">
          {t("landing.contact")} 
        </h3> 
        <p className="text-muted-foreground text-center mb-6">
          {t("landing.reply")} 
        </p> 
        <form onSubmit={handleSubmit} className="grid gap-4">
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background border border-border rounded-xl p-3"
            placeholder={t("profile.doctor.name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            type="email"
            className="bg-background border border-border rounded-xl p-3"
            placeholder={t("login.Email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <motion.textarea
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            rows={5}
            className="bg-background border border-border rounded-xl p-3"
            placeholder={t("landing.message")}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center">
            <button
              type="submit"
              className={`px-6 py-3 rounded-xl font-semibold text-white ${
                isPending ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
              }`}
              disabled={isPending}>
              {t("landing.sendMes")} 
            </button>
          </motion.div> 
        </form>
      </motion.div> 
    </SectionWrapper>
  );
}
