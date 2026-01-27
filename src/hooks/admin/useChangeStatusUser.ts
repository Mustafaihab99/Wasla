import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserStatus } from "../../api/admin/admin-api";

export default function useChangeStatusUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: changeUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error) => {
            console.error("Status change error:", error);
        }
    });
}