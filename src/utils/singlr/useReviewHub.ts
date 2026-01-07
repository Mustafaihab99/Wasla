import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";

export default function useReviewHub(token: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const connection = createHubConnection(
      "https://waslammka.runasp.net/reviewHub",
      token
    );

    connection.start().then(() => {
      console.log("Connected to reviewHub");
    });

    connection.on("ReviewAdded", () => {
      queryClient.invalidateQueries({ queryKey: ["allreviews"] });
    });

    connection.on("ReviewUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["allreviews"] });
    });

    connection.on("ReviewDeleted", () => {
      queryClient.invalidateQueries({ queryKey: ["allreviews"] });
    });

    return () => {
      connection.stop();
    };
  }, [token, queryClient]);
}
