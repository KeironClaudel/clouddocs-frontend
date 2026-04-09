import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Encapsulates all ProfilePage state and handlers.
 */
export function useProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * Navigates to the change password page.
   */
  function handleGoToChangePassword() {
    navigate("/change-password");
  }

  return {
    handleGoToChangePassword,
    user,
  };
}
