import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "login";

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInput({ ...loginInput, [name]: value });
  };

  return (
    <div className="flex justify-center my-16 px-4 sm:px-8 md:px-16">
      <Tabs
        value={tab}
        onValueChange={(value) => setSearchParams({ tab: value })}
        className="w-full sm:w-100"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="cursor-pointer" value="signup">
            Signup
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="login">
            Login
          </TabsTrigger>
        </TabsList>

        <SignUp />

        <SignIn loginInput={loginInput} handleInputChange={handleInputChange} />
      </Tabs>
    </div>
  );
};

export default Login;
