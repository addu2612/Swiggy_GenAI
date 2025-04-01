
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, MessageSquare, CheckCircle, Clock, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20 md:py-32 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Swiggy
              </h1>
              <p className="text-xl md:text-2xl font-medium italic mb-6">
                Swiggy Karo, Phir Jo Chahe Karo!
              </p>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                India's leading food delivery platform now helps teams collect, organize, and act on feedback 
                with voice recording, smart text editing, and powerful admin tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6 mt-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-yellow-400 text-orange-600 hover:bg-gradient-to-r from-violet-500 via-indigo-500 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 hover:text-black transition-all duration-300"
              >
              <Link to="/login/user">
                Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-orange-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-gradient">How Swiggy Helps</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-lg">
              Just like we deliver food on time, we help deliver feedback that matters
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 [&>*]:animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Voice Recording</h3>
              <p className="text-gray-500">
                Record feedback naturally with our voice-to-text technology that captures every detail.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Text Editor</h3>
              <p className="text-gray-500">
                Review and refine feedback with our intuitive text editor designed for clarity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Request Management</h3>
              <p className="text-gray-500">
                Track and respond to feedback requests from peers, managers, and stakeholders.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-500">
                Stay informed with instant notifications and status updates on feedback progress.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-500">
                Secure access control with separate user and admin portals for streamlined management.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-500">
                Transform feedback into actionable insights with our Gemini-powered AI summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to transform your feedback process?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join thousands of teams that use Swiggy to capture and act on meaningful feedback.
              </p>
            </div>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link to="/register">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
