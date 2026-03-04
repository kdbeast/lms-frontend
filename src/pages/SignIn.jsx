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
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth, useSignIn, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignIn = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { signIn, setActive, isLoaded } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const complete = await signIn.create({
        identifier: data.email,
        password: data.password,
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
      toast.error(err?.errors?.[0]?.message);
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

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 m-5">
          <Input
            name="email"
            placeholder="Email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "This is required",
              minLength: {
                value: 8,
                message: "Min length is 8",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <CardFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
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
        </form>
      </Card>
    </TabsContent>
  );
};

export default SignIn;
