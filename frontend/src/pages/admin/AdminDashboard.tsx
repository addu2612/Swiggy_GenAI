import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ArrowUpRight, BarChart3, CheckCircle, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeedbackStore } from "@/utils/feedbackService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const feedbackStore = useFeedbackStore();
  const [chartData, setChartData] = useState([]);
  
  // Prepare chart data
  useEffect(() => {
    // Get data for the last 7 days
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Randomly distribute completed feedback for demo purposes
      // In a real app, this would come from actual data
      const completed = feedbackStore.data.completedRequests.filter(
        r => new Date(r.completedDate).toDateString() === date.toDateString()
      ).length;
      
      // Randomly distribute pending feedback
      const pending = Math.floor(Math.random() * 3);
      
      data.push({
        date: dateStr,
        completed,
        pending
      });
    }
    
    setChartData(data);
  }, [feedbackStore.data.completedRequests]);

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Feedback management overview</p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link to="/admin/feedback-requests">
            View All Requests <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Pending Requests</span>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardTitle>
            <CardDescription>Awaiting completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStore.data.pendingRequests.length}</div>
            <div className="flex items-center mt-1 text-sm">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+4 from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Completed</span>
              <CheckCircle className="h-4 w-4 text-orange-500" />
            </CardTitle>
            <CardDescription>Feedback submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStore.data.completedRequests.length}</div>
            <div className="flex items-center mt-1 text-sm">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+12 from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Active Users</span>
              <Users className="h-4 w-4 text-orange-500" />
            </CardTitle>
            <CardDescription>Past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStore.data.activeUsers}</div>
            <div className="flex items-center mt-1 text-sm">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+3 from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Completion Rate</span>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </CardTitle>
            <CardDescription>Feedback response rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStore.data.completionRate}%</div>
            <div className="flex items-center mt-1 text-sm">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Overview</CardTitle>
              <CardDescription>
                Summary of feedback activities across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" name="Completed" fill="#f97316" />
                    <Bar dataKey="pending" name="Pending" fill="#cbd5e1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest feedback submissions and requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Feedback submitted", user: "John Doe", team: "Design", time: "2 hours ago" },
                  { action: "Request created", user: "Jane Smith", team: "Marketing", time: "5 hours ago" },
                  { action: "Feedback submitted", user: "Robert Johnson", team: "Engineering", time: "Yesterday" },
                  { action: "Request completed", user: "Lisa Wong", team: "Product", time: "Yesterday" },
                  { action: "New user registered", user: "Michael Brown", team: "Customer Support", time: "2 days ago" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.action}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.user} ({item.team})
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>
                Feedback completion rates by team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { team: "Product", requestsSent: 15, requestsCompleted: 12, completionRate: "80%" },
                  { team: "Engineering", requestsSent: 22, requestsCompleted: 18, completionRate: "82%" },
                  { team: "Design", requestsSent: 10, requestsCompleted: 9, completionRate: "90%" },
                  { team: "Marketing", requestsSent: 8, requestsCompleted: 5, completionRate: "63%" },
                  { team: "Customer Support", requestsSent: 12, requestsCompleted: 7, completionRate: "58%" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.team}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.requestsCompleted} of {item.requestsSent} requests completed
                      </p>
                    </div>
                    <div className="font-medium text-orange-500">{item.completionRate}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;