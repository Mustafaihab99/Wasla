import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateDoctorService } from "../../api/doctor/doctor-api";

export default function useUpdateDoctorService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-doctorService"],
    mutationFn: UpdateDoctorService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-services"] , exact:false});
    },
  });
}
