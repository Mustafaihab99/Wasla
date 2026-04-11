import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { toast } from "sonner";
import useSetRestaurantProfile from "../../hooks/restaurant/useSetRestaurantProfile";
import useGetRestaurantSpecial from "../../hooks/restaurant/useGetRestaurantSpecial";

export default function RestaurantForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSetRestaurantProfile();

  const [preview, setPreview] = useState<string | null>(null);
  const [galleryNames, setGalleryNames] = useState<string[]>([]);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(t("restaurant.failed"));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ setFieldValue }) => (
        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Image */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <label className="cursor-pointer">
              <div className="w-28 h-28 rounded-full overflow-hidden border flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <FaCamera />
                )}
              </div>

              <input
                type="file"
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
          </div>

          {/* Name */}
          <div>
            <label>{t("restaurant.name")}</label>
            <Field name="name" className="input" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          {/* Owner */}
          <div>
            <label>{t("restaurant.owner")}</label>
            <Field name="ownerName" className="input" />
            <ErrorMessage name="ownerName" component="div" className="error" />
          </div>

          {/* Phone */}
          <div>
            <label>{t("restaurant.phone")}</label>
            <Field name="phoneNumber" className="input" />
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="error"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground">
              {t("restaurant.category")}
            </label>

            <Field
              as="select"
              name="restaurantCategoryId"
              className="p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition">
              <option value="">
                {catLoading ? t("loading") : t("restaurant.selectCategory")}
              </option>

              {!catLoading &&
                categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </Field>

            <ErrorMessage
              name="restaurantCategoryId"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label>{t("restaurant.description")}</label>
            <Field as="textarea" name="description" className="input" />
          </div>

          {/* Gallery */}
          <div className="lg:col-span-2">
            <label>{t("restaurant.gallery")}</label>

            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                if (files.length > 5) {
                  toast.error(t("restaurant.maxGallery"));
                  return;
                }

                setFieldValue("gallery", files);
                setGalleryNames(files.map((f) => f.name));
              }}
            />

            {galleryNames.map((n, i) => (
              <div key={i}>📸 {n}</div>
            ))}
          </div>

          {/* Submit */}
          <div className="lg:col-span-2">
            <button disabled={isPending} className="btn-primary">
              {isPending ? "Saving..." : t("restaurant.save")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
