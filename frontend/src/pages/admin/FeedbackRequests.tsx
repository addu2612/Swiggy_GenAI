
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Download, Eye, Search, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


// Mock data for pending feedback requests
const mockPendingRequests = [
  {
    id: 1,
    requestedBy: "Sarah Chen",
    requestedFor: "Product Team Quarterly Review",
    assignedTo: "John Doe",
    dueDate: "2023-07-25",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    requestedBy: "Michael Johnson",
    requestedFor: "Marketing Campaign Assessment",
    assignedTo: "Jane Smith",
    dueDate: "2023-07-28",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    requestedBy: "Lisa Wong",
    requestedFor: "Engineering Sprint Retrospective",
    assignedTo: "Robert Johnson",
    dueDate: "2023-07-30",
    status: "pending",
    priority: "low",
  },
  {
    id: 4,
    requestedBy: "David Miller",
    requestedFor: "Design Team Feedback",
    assignedTo: "Emily Davis",
    dueDate: "2023-08-05",
    status: "pending",
    priority: "medium",
  },
  {
    id: 5,
    requestedBy: "Kevin Parker",
    requestedFor: "Customer Support Performance",
    assignedTo: "Michelle Thomas",
    dueDate: "2023-08-10",
    status: "pending",
    priority: "high",
  },
];

const mockCompletedRequests = [
  {
    id: 101,
    requestedBy: "Alex Johnson",
    requestedFor: "Q1 Performance Review",
    assignedTo: "John Doe",
    completedDate: "2023-06-15",
    status: "completed",
  },
  {
    id: 102,
    requestedBy: "Taylor Swift",
    requestedFor: "Website Redesign Feedback",
    assignedTo: "Jane Smith",
    completedDate: "2023-06-28",
    status: "completed",
  },
  {
    id: 103,
    requestedBy: "Jordan Lee",
    requestedFor: "New Product Feature",
    assignedTo: "Robert Johnson",
    completedDate: "2023-07-05",
    status: "completed",
  },
];

const FeedbackRequests = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [feedbackDetails, setFeedbackDetails] = useState("");

  const filteredPendingRequests = mockPendingRequests.filter(request => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      request.requestedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply priority filter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const filteredCompletedRequests = mockCompletedRequests.filter(request => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      request.requestedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-50";
      case "medium": return "text-orange-500 bg-orange-50";
      case "low": return "text-green-500 bg-green-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    // In a real app, you would fetch the full feedback details here
    setFeedbackDetails(
      request.status === "completed"
        ? "This feedback was completed on " + new Date(request.completedDate).toLocaleDateString() + ". The feedback provided valuable insights about the project's strengths and areas for improvement. It highlighted excellent communication and teamwork, while suggesting more documentation would be beneficial in the future."
        : "This feedback request is pending completion. It was assigned to " + request.assignedTo + " and is due by " + new Date(request.dueDate).toLocaleDateString() + "."
    );
  };

  const handleRemindUser = (requestId: number) => {
    toast({
      title: "Reminder sent",
      description: `A reminder has been sent to the assigned user for request #${requestId}.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Feedback requests data is being prepared for download.",
    });
  };

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Feedback Requests</h1>
          <p className="text-muted-foreground">Manage and track all feedback requests</p>
        </div>
        <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, team, or keywords..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="priority-filter" className="sr-only">
                Filter by Priority
              </Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priority-filter" className="w-[180px]">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="mb-8">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending <span className="ml-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-xs font-medium">{filteredPendingRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-medium">{filteredCompletedRequests.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Feedback Requests</CardTitle>
              <CardDescription>
                Feedback requests that are awaiting response
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredPendingRequests.map((request) => (
                    <div key={request.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${request.priority === 'high' ? 'bg-red-500' : request.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                          <h3 className="font-medium">{request.requestedFor}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground mt-1 gap-2 sm:gap-4">
                          <span>Requested by: {request.requestedBy}</span>
                          <span>Assigned to: {request.assignedTo}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-orange-500" />
                            Due: {new Date(request.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:self-end md:self-auto">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{request.requestedFor}</DialogTitle>
                              <DialogDescription>Feedback request details</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Requested By</p>
                                  <p className="text-sm text-muted-foreground">{request.requestedBy}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Assigned To</p>
                                  <p className="text-sm text-muted-foreground">{request.assignedTo}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Due Date</p>
                                  <p className="text-sm text-muted-foreground">{new Date(request.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Priority</p>
                                  <p className={`text-sm ${request.priority === 'high' ? 'text-red-500' : request.priority === 'medium' ? 'text-orange-500' : 'text-green-500'}`}>
                                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Details</p>
                                <p className="text-sm text-muted-foreground mt-1">{feedbackDetails}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => handleRemindUser(request.id)}
                              >
                                Send Reminder
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemindUser(request.id)}
                        >
                          Remind
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <X className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No Pending Requests</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No pending feedback requests match your filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setPriorityFilter("all");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Feedback</CardTitle>
              <CardDescription>
                Feedback requests that have been completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCompletedRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredCompletedRequests.map((request) => (
                    <div key={request.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{request.requestedFor}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground mt-1 gap-2 sm:gap-4">
                          <span>Requested by: {request.requestedBy}</span>
                          <span>Completed by: {request.assignedTo}</span>
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Completed: {new Date(request.completedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Feedback
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{request.requestedFor}</DialogTitle>
                              <DialogDescription>Completed feedback details</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Requested By</p>
                                  <p className="text-sm text-muted-foreground">{request.requestedBy}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Completed By</p>
                                  <p className="text-sm text-muted-foreground">{request.assignedTo}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Completion Date</p>
                                  <p className="text-sm text-muted-foreground">{new Date(request.completedDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  <p className="text-sm text-green-500">Completed</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Feedback Content</p>
                                <p className="text-sm text-muted-foreground mt-1">{feedbackDetails}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  toast({
                                    title: "Feedback downloaded",
                                    description: "The feedback report has been downloaded",
                                  });
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Report
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <X className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No Completed Requests</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No completed feedback requests match your filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackRequests;
