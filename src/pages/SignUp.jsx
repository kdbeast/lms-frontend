import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
// import { z } from "zod";
// import { toast } from "sonner";

// const signupSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   role: z.enum(["student", "instructor"], {
//     errorMap: () => ({ message: "Select a role" }),
//   }),
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

const SignUp = ({ signupInput, handleInputChange, handleRoleChange }) => {
  const { getToken } = useAuth();
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSignup = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      console.log("creating user");
      await signUp.create({
        emailAddress: signupInput.email,
        password: signupInput.password,
        firstName: signupInput.name,
        unsafeMetadata: {
          role: signupInput.role,
        },
      });
      console.log("User created");

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (err) {
      console.log(err, "user created fail");
      setErrors({
        general: err.errors?.[0]?.message || "Something went wrong",
      });
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
      setErrors({ verification: "Invalid verification code" });
      console.log(err);
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <Button onClick={handleVerify} className="w-full mt-2">
                  Verify Email
                </Button>
              )}
            </>
          ) : (
            <>
              <Label>Select Role</Label>
              <Select value={signupInput.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}

              <Input
                name="name"
                placeholder="Name"
                value={signupInput.name}
                onChange={(e) => handleInputChange(e, "signup")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <Input
                name="email"
                placeholder="Email"
                value={signupInput.email}
                onChange={(e) => handleInputChange(e, "signup")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={signupInput.password}
                onChange={(e) => handleInputChange(e, "signup")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

              {errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}

              <Button
                onClick={handleSignup}
                className="w-full"
                disabled={loading}
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
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SignUp;
