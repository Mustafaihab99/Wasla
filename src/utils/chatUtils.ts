import { format, isToday, isYesterday, parseISO } from "date-fns";

export function formatChatTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd/MM/yy");
  } catch {
    return "";
  }
}