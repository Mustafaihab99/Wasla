import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";

export default function useBookingHub(token: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const connection = createHubConnection(
    "https://waslammka.runasp.net/bookingHub",
      token
    );

    connection.start().then(() => {
      console.log("Connected to bookingHub");
    });

    connection.on("BookingCompleted", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-book-list"] });
      queryClient.invalidateQueries({ queryKey: ["mybooking"] });
    });

    connection.on("BookingUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-book-list"] });
      queryClient.invalidateQueries({ queryKey: ["mybooking"] });
    });

    connection.on("BookingCanceled", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-book-list"] });
      queryClient.invalidateQueries({ queryKey: ["mybooking"] });
    });

    connection.on("ServiceDayBooked", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-book-list"] });
    });

    return () => {
      connection.stop();
    };
  }, [token, queryClient]);
}
