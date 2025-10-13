import { useMutation } from "@tanstack/react-query"
import { loginApi } from "../../api/auth/auth-api"

export default function useLogin(){
    return(
        useMutation({
            mutationFn: loginApi,
            onSuccess: () =>{
                // navigate
            }
        })
    )
}