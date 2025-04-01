
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { role } = useParams<{ role: string }>();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validRole = role === "admin" || role === "user" ? role : "user";
  const roleLabel = validRole.charAt(0).toUpperCase() + validRole.slice(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter both email and password",
      });
      return;
    }
    
    try {
      await login(email, password, validRole as "user" | "admin");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Demo credentials
  const demoCredentials = validRole === "admin" 
    ? { email: "admin@example.com", password: "admin123" }
    : { email: "user@example.com", password: "user123" };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  return (
    <div className="container max-w-md py-16 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{roleLabel} Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the {validRole} portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4">
            {/* <Button
              variant="outline"
              onClick={fillDemoCredentials}
              className="w-full"
              type="button"
            >
              Use Demo Credentials
            </Button> */}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:text-orange-600">
              Sign up
            </Link>
          </div>
          {validRole === "user" ? (
            <Link to="/login/admin" className="text-sm text-orange-500 hover:text-orange-600">
              Admin Login
            </Link>
          ) : (
            <Link to="/login/user" className="text-sm text-orange-500 hover:text-orange-600">
              User Login
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
