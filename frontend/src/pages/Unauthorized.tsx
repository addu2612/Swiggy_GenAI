
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-orange-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link to="/">Return to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login/user">Switch Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
