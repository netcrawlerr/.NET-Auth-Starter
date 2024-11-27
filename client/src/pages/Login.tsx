import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Facebook } from "lucide-react";
import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: FormEvent<HTMLFormElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe,
      });

      const data = await response.data;
      console.log("**********");
      console.log("Login Success", data);
      console.log("**********");

      navigate("/dashboard");
      // alert("Login successful!");
    } catch (error) {
      console.log(error.response.data);

      setError(
        error.response.data || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <span className="text-sm text-red-500">{error}</span>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="rememberMe"
                  value={rememberMe}
                  onCheckedChange={handleRememberMeChange}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="w-full text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Separator />
          <div className="grid w-full grid-cols-3 gap-2">
            <Button variant="outline" size="icon">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
