import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { UserIcon } from "lucide-react";
import { COLORS } from "@/constants/theme";

interface SocialAuthButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function GoogleAuthButton({ onClick, disabled }: SocialAuthButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className="w-full"
      style={{ 
        backgroundColor: COLORS.google,
        "&:hover": { backgroundColor: COLORS.googleHover }
      }}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}

export function GuestAuthButton({ onClick, isLoading }: SocialAuthButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      className="w-full"
      style={{ 
        backgroundColor: COLORS.primary,
        color: COLORS.text.primary,
        "&:hover": { backgroundColor: COLORS.primaryHover }
      }}
    >
      <UserIcon className="mr-2 h-5 w-5" />
      {isLoading ? "Logging in..." : "Continue as Guest"}
    </Button>
  );
}
