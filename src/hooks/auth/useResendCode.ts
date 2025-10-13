import { useMutation } from "@tanstack/react-query";
import { resendApi } from "../../api/auth/auth-api";

export default function useResendCode(){
    return useMutation({
        mutationFn: resendApi,
    })
}