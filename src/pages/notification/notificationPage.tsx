import { useState } from "react";
import useGetNotifications from "../../hooks/notifications/useGetNotifications";
import NotificationCard from "../../components/notifications/NotificationCard";
import useMarkAllAsRead from "../../hooks/notifications/useMarkAllAsRead";
import { EmptyNotifications } from "../../components/notifications/EmptyNotification";
import { useTranslation } from "react-i18next";

interface Props {
  userId: string;
}

export default function NotificationsPage({ userId }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { t } = useTranslation();

  const { data, isLoading } = useGetNotifications(page, pageSize, userId);
  const { mutate: markAll, isPending } = useMarkAllAsRead();

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-dried">
        {t("notification.loading")}
      </div>
    );
  }

  return (
    <div className="p-4 bg-background min-h-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("notification.title")}
        </h2>

        {data!.data.length > 0 && (
          <button
            onClick={() => markAll(userId)}
            disabled={isPending}
            className="text-sm text-primary hover:underline"
          >
            {t("notification.markAll")}
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {data?.data.length ? (
          data.data.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))
        ) : (
          <EmptyNotifications />
        )}
      </div>

      {/* Pagination */}
      {data!.data.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-8">

          <button
            disabled={page === 1}
            onClick={() => {
              setPage((prev) => prev - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3 py-1 border rounded-md text-sm border-border disabled:opacity-50"
          >
            {t("notification.prev")}
          </button>

          <span className="text-sm text-foreground">
            {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => {
              setPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3 py-1 border rounded-md text-sm border-border disabled:opacity-50"
          >
            {t("notification.next")}
          </button>

        </div>
      )}
    </div>
  );
}