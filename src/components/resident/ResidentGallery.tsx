import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import docImage from "../../assets/images/bookdoctor.jpg";
import gymImage from "../../assets/images/gym.png";
import driverImage from "../../assets/images/ride.jpg";
import resImage from "../../assets/images/Revolving-Restaurant-3.jpg";
import tecImage from "../../assets/images/technican.jpg";

export default function ResidentGallery() {
  const {t} = useTranslation();

  const slides = [
    { img: docImage, title: t("resident.doctor") },
    { img: gymImage, title: t("resident.gym") },
    { img: driverImage, title: t("resident.driver") },
    { img: resImage, title: t("resident.rest") },
    { img: tecImage, title: t("resident.technical") },
  ];

  return (
    <section 
    style={{direction:"ltr"}}
    className="mb-14 h-[700px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        spaceBetween={15}
        slidesPerView={1}
        className="rounded-xl h-[660px]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative rounded-xl overflow-hidden shadow border border-border">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-[600px] object-cover"
                loading="lazy"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-3 text-center">
                <p className="text-lg font-semibold">{slide.title}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
