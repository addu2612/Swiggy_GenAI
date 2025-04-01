import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    pendingFeedback, 
    recentFeedback, 
    feedbackStats,
    removePendingFeedback, 
    submitDraft
  } = useFeedback();

  // Handle responding to a pending feedback request
  const handleRespondClick = (id: number) => {
    // Navigate to record feedback page with request ID
    navigate(`/user/record-feedback?request=${id}`);
  };

  // Handle continuing a draft
  const handleContinueDraft = (id: number) => {
    // Navigate to record feedback page with draft ID
    navigate(`/user/record-feedback?draft=${id}`);
  };

  // Handle direct submission of a draft
  const handleSubmitDraft = (id: number) => {
    submitDraft(id);
    toast({
      title: "Feedback submitted",
      description: "Your draft has been successfully submitted.",
    });
  };

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your feedback activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/user/record-feedback">
              Record New Feedback <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
            <Link to="/user/ai-feedback-summary">
              <Sparkles className="mr-2 h-4 w-4" /> AI Summary Tool
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Requests</CardTitle>
            <CardDescription>Feedback you need to provide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Feedback Provided</CardTitle>
            <CardDescription>Total feedback submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStats.provided}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Feedback Received</CardTitle>
            <CardDescription>Feedback from others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{feedbackStats.received}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="mb-8">
        <TabsList>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Requests</CardTitle>
              <CardDescription>
                Feedback requests that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingFeedback.length > 0 ? (
                <div className="space-y-4">
                  {pendingFeedback.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{item.requestedFor}</h3>
                        <p className="text-sm text-muted-foreground">
                          Requested by: {item.requestedBy}
                        </p>
                        <div className="flex items-center mt-1 text-sm">
                          <Clock className="h-3 w-3 mr-1 text-orange-500" />
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleRespondClick(item.id)}
                      >
                        Respond
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Pending Requests</h3>
                  <p className="text-muted-foreground">
                    You don't have any feedback requests awaiting your response.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Feedback you've recently provided
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentFeedback.length > 0 ? (
                <div className="space-y-4">
                  {recentFeedback.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{item.topic}</h3>
                        <p className="text-sm text-muted-foreground">
                          For: {item.recipient}
                        </p>
                        <div className="flex items-center mt-1 text-sm">
                          <Clock className="h-3 w-3 mr-1 text-orange-500" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {item.status === "Submitted" ? (
                          <span className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleContinueDraft(item.id)}
                            >
                              Continue Draft
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSubmitDraft(item.id)}
                            >
                              Submit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Recent Feedback</h3>
                  <p className="text-muted-foreground">
                    You haven't provided any feedback recently.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
