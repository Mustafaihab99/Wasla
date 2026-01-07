import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";

export default function useServiceHub(token: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const connection = createHubConnection(
      import.meta.env.BASE_URL + "serviceHub",
      token
    );

    connection.start().then(() => {
      console.log("Connected to serviceHub");
    });

    connection.on("ServiceAdded", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-services"] });
    });

    connection.on("ServiceUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-services"] });
    });

    connection.on("ServiceDeleted", () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-services"] });
    });

    return () => {
      connection.stop();
    };
  }, [token, queryClient]);
}
