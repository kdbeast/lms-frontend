import { AppWindowIcon, CodeIcon } from "lucide-react";
// xFTZ1ophVCVdDXlt
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [isLogin, setIsLogin] = useState({ email: "", password: "" });
  const [isSignup, setIsSignup] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegistration = (type) => {
    const inputData = type === "signup" ? isSignup : isLogin;
    console.log(inputData);
  };

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") {
      setIsLogin({ ...isLogin, [name]: value });
    } else {
      setIsSignup({ ...isSignup, [name]: value });
    }
  };

  return (
    <div className="flex items-center w-full justify-center">
      <Tabs defaultValue="signup">
        <TabsList>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to get started.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
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
                <Label htmlFor="username">Email</Label>
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
                <Label htmlFor="password">Password</Label>
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
              <Button onClick={() => handleRegistration("signup")}>
                Sign Up
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your account.</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="email"
                  name="email"
                  required={true}
                  value={isLogin.email}
                  placeholder="Enter your email"
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  required={true}
                  value={isLogin.password}
                  placeholder="Enter your password"
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={() => handleRegistration("login")}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
