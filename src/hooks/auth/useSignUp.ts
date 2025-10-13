import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../../api/auth/auth-api";

export default function useSignUp(){
    return useMutation(
        {
            mutationFn: signupApi,
        }
    )
}