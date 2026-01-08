import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterUserMutation } from "../features/api/authApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";

const Register = () => {
  const [isSignup, setIsSignup] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });
  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();

  const handleRegistration = async (type) => {
    const inputData = type === "signup" && isSignup;
    await registerUser(inputData);
  };

  const handleRoleChange = (role) => {
    setIsSignup({ ...isSignup, role });
  };

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setIsSignup({ ...isSignup, [name]: value });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-36">
      <Tabs defaultValue="signup">
        <TabsList>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to get started.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label>Select Role</Label>
                <Select value={isSignup.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Your Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Your Role</SelectLabel>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  required={true}
                  value={isSignup.name}
                  placeholder="Enter your name"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>

              <div className="grid gap-3">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  required={true}
                  value={isSignup.email}
                  placeholder="Enter your email"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>

              <div className="grid gap-3">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  required={true}
                  value={isSignup.password}
                  placeholder="Enter your password"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                disabled={registerLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Register;
