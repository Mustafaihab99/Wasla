import { useMutation } from "@tanstack/react-query";
import { verifyEmailApi } from "../../api/auth/auth-api";

export default function useVerifyEmail(){
    return useMutation({
        mutationFn: verifyEmailApi,
    })
}