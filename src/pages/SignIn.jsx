import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth, useSignIn, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

const SignIn = ({ loginInput, handleInputChange }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const complete = await signIn.create({
        identifier: loginInput.email,
        password: loginInput.password,
      });

      if (complete.status === "complete") {
        await setActive({ session: complete.createdSessionId });

        const token = await getToken();

        await fetch("http://localhost:8080/api/v1/user/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await user?.reload();

        navigate("/");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsContent value="login">
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Login using your email and password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={loginInput.email}
              placeholder="abc@gmail.com"
              onChange={(e) => handleInputChange(e, "login")}
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={loginInput.password}
              onChange={(e) => handleInputChange(e, "login")}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>

        <CardFooter>
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default SignIn;
