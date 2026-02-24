import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../features/api/authApi";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [defaultTab, setDefaultTab] = useSearchParams();
  const tab = defaultTab.get("tab") || "login";

  const [loginUser, { isLoading: isLogginIn }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;

    try {
      const result = await action(inputData).unwrap();
      if (result) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleChange = (value) => {
    setSignupInput({ ...signupInput, role: value });
  };

  return (
    <div className="flex justify-center my-16 px-4 sm:px-8 md:px-16">
      <Tabs
        value={tab}
        onValueChange={(val) => setDefaultTab({ tab: val })}
        className="w-full sm:w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-3">
                <Label>Select Role</Label>
                <Select
                  value={signupInput.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full">
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
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => handleInputChange(e, "signup")}
                  id="name"
                  type="text"
                  placeholder="Patel"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => handleInputChange(e, "signup")}
                  placeholder="abc@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => handleInputChange(e, "signup")}
                  placeholder="Password"
                />
              </div>
            </CardContent>
            <CardFooter>
              {isRegistering ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  onClick={() => handleRegistration("signup")}
                  className="w-full"
                >
                  Signup
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => handleInputChange(e, "login")}
                  placeholder="abc@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => handleInputChange(e, "login")}
                  placeholder="Password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={isLogginIn}
                className="w-full"
                onClick={() => handleRegistration("login")}
              >
                {isLogginIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
