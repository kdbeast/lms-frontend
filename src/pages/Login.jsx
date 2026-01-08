import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../features/api/authApi";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginLoading,
      isSuccess: loginSuccess,
    },
  ] = useLoginUserMutation();
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerLoading,
      isSuccess: registerSuccess,
    },
  ] = useRegisterUserMutation();

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? isSignup : isLogin;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") {
      setIsLogin({ ...isLogin, [name]: value });
    } else {
      setIsSignup({ ...isSignup, [name]: value });
    }
  };

  useEffect(() => {
    if (registerSuccess && registerData) {
      toast.success("User registered successfully");
      navigate("/");
    }
    if (registerError) {
      toast.error(registerError.data.message || "User registration failed");
    }
    if (loginSuccess && loginData) {
      toast.success(loginData.message || "User logged in successfully");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "User login failed");
    }
  }, [
    navigate,
    loginData,
    loginError,
    registerData,
    loginSuccess,
    registerError,
    registerSuccess,
  ]);

  return (
    <div className="w-full max-w-sm mx-auto mt-48">
      <Tabs defaultValue="login">
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
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your account.</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label>Username</Label>
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
                <Label>Password</Label>
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
              <Button
                disabled={loginLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
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
