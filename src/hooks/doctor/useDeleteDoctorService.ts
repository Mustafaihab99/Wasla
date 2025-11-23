import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDoctorService } from "../../api/doctor/doctor-api";

export default function useDeleteDotorService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-doctorService"],
    mutationFn: (serviceID: number) => DeleteDoctorService(serviceID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-services"] });
    },
  });
}
