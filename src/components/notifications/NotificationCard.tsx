import { notificationData } from "../../types/notifications/notification-types";
import { getNotificationAction } from "../../utils/notification-handler";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import useMarkNotifyAsRead from "../../hooks/notifications/useMarkNotifyAsRead";
import useDeleteNotify from "../../hooks/notifications/useDeleteNotify";
import { FiTrash2, FiCheck } from "react-icons/fi";
import incomeImage from "../../assets/images/income.png";

export default function NotificationCard({
  notification,
}: {
  notification: notificationData;
}) {
  const navigate = useNavigate();

  const { mutate: markAsRead, isPending: marking } = useMarkNotifyAsRead();
  const { mutate: deleteNotify, isPending: deleting } = useDeleteNotify();

  const action = getNotificationAction(
    notification.type,
    notification.referenceId,
  );

  const handleClick = () => {
    if (!notification.isSeen) {
      markAsRead(notification.id);
    }

    if (action.type === "navigate" && action.path) {
      navigate(action.path);
    }

    if (action.type === "external" && action.url) {
      window.open(action.url, "_blank");
    }

    if (action.type === "modal") {
      console.log("Open modal with:", action.url);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "group p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
        "bg-background text-foreground border-border",
        "hover:shadow-md hover:-translate-y-[2px]",
        !notification.isSeen && "border-primary bg-primary/5 shadow-sm",
      )}>
      <div className="flex gap-3 items-start">
        {/* Image */}
        <img
          src={notification.imageUrl ?? incomeImage}
          loading="lazy"
          className="w-12 h-12 rounded-full object-cover border border-border"
        />

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold group-hover:text-primary transition">
            {notification.title}
          </h4>

          <p className="text-sm text-dried line-clamp-2">{notification.body}</p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-dried">
              {new Date(notification.createdAt).toLocaleString()}
            </span>

            {!notification.isSeen && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </div>

          {/* Actions */}
          <div
            className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition"
            onClick={(e) => e.stopPropagation()}>
            {!notification.isSeen && (
              <button
                onClick={() => markAsRead(notification.id)}
                disabled={marking}
                className="p-2 rounded-full hover:bg-green-300 text-green-500 transition">
                <FiCheck size={16} />
              </button>
            )}

            <button
              onClick={() => deleteNotify(notification.id)}
              disabled={deleting}
              className="p-2 rounded-full hover:bg-red-300 text-red-500 transition">
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
