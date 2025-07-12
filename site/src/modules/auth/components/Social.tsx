import { Button } from "@/components/ui/button";
import { defauthLoginRedirect } from "@/routes";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { FcGoogle } from "react-icons/fc";

const Social = () => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signIn("google", { redirectTo: defauthLoginRedirect });
    });
  };
  return (
    <Button
      disabled={isPending}
      onClick={handleClick}
      size={"xl"}
      className="space-x-4 w-full"
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <FcGoogle size={18} />
      )}
      <span>Continue with Google</span>
    </Button>
  );
};
export default Social;
