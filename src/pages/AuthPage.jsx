import { SignIn, SignUp } from "@clerk/clerk-react";
import { useSearchParams } from "react-router";

const AuthPage = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode") || "sign-in";

  return (
    <div className="flex items-center justify-center min-h-screen">
      {mode === "sign-up" ? (
        <SignUp routing="path" path="/auth" afterSignUpUrl="/select-role" />
      ) : (
        <SignIn routing="path" path="/auth" />
      )}
    </div>
  );
};

export default AuthPage;