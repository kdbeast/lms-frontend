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
import { useLoginUserMutation } from "../features/api/authApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [isLogin, setIsLogin] = useState({ email: "", password: "" });
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const handleRegistration = async (type) => {
    const inputData = type === "login" && isLogin;
    await loginUser(inputData);
  };

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") {
      setIsLogin({ ...isLogin, [name]: value });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-48">
      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your account.</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label>Email</Label>
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
