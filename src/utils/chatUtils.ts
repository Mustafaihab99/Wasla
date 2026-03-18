import { format, isToday, isYesterday, parseISO } from "date-fns";

export function formatChatTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday";

    return format(date, "dd MMM");
  } catch {
    return "";
  }
}

export function formatLastSeen(
  dateStr?: string,
  t?: (key: string) => string
) {
  if (!dateStr) return "";

  try {
    const date = parseISO(dateStr);

    if (isToday(date)) {
      return `${t ? t("chat.lastSeenToday") : "Last seen today"}, ${format(
        date,
        "HH:mm"
      )}`;
    }

    if (isYesterday(date)) {
      return `${t ? t("chat.lastSeenYesterday") : "Last seen yesterday"}, ${format(
        date,
        "HH:mm"
      )}`;
    }

    return `${t ? t("chat.lastSeen") : "Last seen"} ${format(
      date,
      "dd MMM, HH:mm"
    )}`;
  } catch {
    return "";
  }
}