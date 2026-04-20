import { useTranslation } from "react-i18next";
import notify from "../../assets/images/notify.png";

export function EmptyNotifications() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 mt-16 sm:mt-20 overflow-y-hidden">

      <img
        src={notify}
        alt="no notification"
        loading="lazy"
        className="w-28 h-22 sm:w-20 sm:h-20 md:w-36 md:h-32 opacity-80"
      />

      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mt-4">
        {t("notification.emptyTitle")}
      </h3>

      <p className="text-xs sm:text-sm md:text-base text-dried mt-2 max-w-sm sm:max-w-md">
        {t("notification.emptyDesc")}
      </p>
    </div>
  );
}