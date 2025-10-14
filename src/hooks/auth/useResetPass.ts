import { useMutation } from "@tanstack/react-query";
import { forgetPassApi } from "../../api/auth/auth-api";

export default function useResetPass(){
    return useMutation({
        mutationFn : forgetPassApi,
    })
}