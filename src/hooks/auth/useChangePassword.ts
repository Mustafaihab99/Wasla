import { useMutation } from "@tanstack/react-query";
import { changePassApi } from "../../api/auth/auth-api";

export default function useChangePassword(){
    return useMutation({
        mutationKey : ["change-password"],
        mutationFn: changePassApi,
    })
}