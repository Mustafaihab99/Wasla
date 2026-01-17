import { useMutation } from "@tanstack/react-query";
import { logout } from "../../api/auth/auth-api";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user_id");
      localStorage.removeItem("auth_token");

      navigate("/auth/login");
    },
  });
}
