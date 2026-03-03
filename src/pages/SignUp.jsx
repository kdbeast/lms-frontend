import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth, useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUp = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "student",
      name: "",
      email: "",
      password: "",
    },
  });
  console.log(errors);

  const handleSignup = async (data) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
        unsafeMetadata: {
          role: data.role,
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (err) {
      console.log("Verification error:", err);

      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Verification failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const complete = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (complete.status === "complete") {
        await setActive({ session: complete.createdSessionId });

        const token = await getToken();
        console.log("TOKEN:", token);
        const res = await fetch("http://localhost:8080/api/v1/user/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);

        navigate("/");
      }
    } catch (err) {
      console.log("Verification error:", err);

      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Verification failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsContent value="signup">
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Create a new account and click signup when you're done.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {verifying ? (
            <>
              <Label>Enter Verification Code</Label>
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {errors.verification && (
                <p className="text-red-500 text-sm">{errors.verification}</p>
              )}
              <Button
                onClick={handleVerify}
                className="w-full mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
              <Label>Select Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Input
                placeholder="Name"
                {...register("name", {
                  required: "This is required",
                  minLength: {
                    value: 3,
                    message: "Min length is 3",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

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
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}

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
                  "Signup"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SignUp;
