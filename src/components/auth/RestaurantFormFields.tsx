import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCamera, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import useSetRestaurantProfile from "../../hooks/restaurant/useSetRestaurantProfile";
import useGetRestaurantSpecial from "../../hooks/restaurant/useGetRestaurantSpecial";


export default function RestaurantForm({ email }: { email: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSetRestaurantProfile();

  const [preview, setPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const { data: categories, isLoading: catLoading } = useGetRestaurantSpecial();
  const initialValues = {
    name: "",
    description: "",
    phoneNumber: "",
    ownerName: "",
    restaurantCategoryId: 0,
    profile: null,
    gallery: [] as File[],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("restaurant.nameReq")),
    description: Yup.string().required(t("restaurant.descReq")),
    phoneNumber: Yup.string().required(t("restaurant.phoneReq")),
    ownerName: Yup.string().required(t("restaurant.ownerReq")),
    restaurantCategoryId: Yup.number()
      .min(1, t("restaurant.categoryReq"))
      .required(t("restaurant.categoryReq")),
    profile: Yup.mixed().required(t("restaurant.profileReq")),
    gallery: Yup.array()
      .min(1, t("restaurant.galleryReq"))
      .max(5, t("restaurant.maxGallery")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData();
      formData.append("email" , email);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("ownerName", values.ownerName);
      formData.append(
        "restaurantCategoryId",
        String(values.restaurantCategoryId),
      );

      if (values.profile) formData.append("profile", values.profile);

      values.gallery.forEach((file) => {
        formData.append("gallery", file);
      });

      await mutateAsync(formData);
      navigate("/auth/login");
    } catch {
      toast.error(t("restaurant.failed"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Image */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <label className="cursor-pointer group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-muted">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <FaCamera className="text-gray-400 w-8 h-8 group-hover:text-primary transition" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("profile", file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              <ErrorMessage
                name="profile"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">{t("restaurant.name")}</label>
              <Field
                name="name"
                className=" w-full p-3 border border-border rounded-lg bg-transparent 
                focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Owner */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                {t("restaurant.owner")}
              </label>
              <Field
                name="ownerName"
                className=" w-full p-3 border border-border rounded-lg bg-transparent 
  focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <ErrorMessage
                name="ownerName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                {t("restaurant.phone")}
              </label>
              <Field
                name="phoneNumber"
                className=" w-full p-3 border border-border rounded-lg bg-transparent 
  focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                {t("restaurant.category")}
              </label>

              <Field
                as="select"
                name="restaurantCategoryId"
                className=" w-full p-3 border border-border rounded-lg bg-transparent 
  focus:outline-none focus:ring-2 focus:ring-primary transition">
                <option value=""
                className="bg-background text-foreground"
                >
                  {catLoading
                    ? t("admin.Loading")
                    : t("restaurant.selectCategory")}
                </option>

                {!catLoading &&
                  categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}
                className="bg-background text-foreground">
                         {cat.name}
                    </option>
                  ))}
              </Field>

              <ErrorMessage
                name="restaurantCategoryId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1">
                {t("restaurant.description")}
              </label>
              <Field
                as="textarea"
                rows={3}
                name="description"
                className=" w-full p-3 border border-border rounded-lg bg-transparent 
  focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            {/* Gallery */}
            <div className="flex flex-col lg:col-span-2">
              <label className="font-medium mb-1">
                {t("restaurant.gallery")}
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                className=" w-full p-3 border border-border rounded-lg bg-transparent 
  focus:outline-none focus:ring-2 focus:ring-primary transition"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);

                  if (files.length > 5) {
                    toast.error(t("restaurant.maxGallery"));
                    return;
                  }

                  setFieldValue("gallery", files);
                  setGalleryPreview(files.map((f) => URL.createObjectURL(f)));
                }}
              />

              <div className="flex gap-2 mt-3 flex-wrap">
                {galleryPreview.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      loading="lazy"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => {
                        const updated = values.gallery.filter(
                          (_, i) => i !== index,
                        );
                        setFieldValue("gallery", updated);
                        setGalleryPreview(
                          updated.map((f) => URL.createObjectURL(f)),
                        );
                      }}>
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="lg:col-span-2">
              <button
                disabled={isPending}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                {isPending ? t("profile.Saving...") : t("restaurant.save")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
