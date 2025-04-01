import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, SendIcon, Edit, Search, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSummary } from "@/utils/geminiApi";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImprovementSuggestions from "@/components/ImprovementSuggestions";

interface FeedbackSummary {
  id: string;
  employeeName: string;
  date: string;
  rawFeedback: string;
  summary: {
    strengths: string[];
    developmentAreas: string[];
  };
}

const FeedbackSummary = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [rawFeedback, setRawFeedback] = useState<string>(
    location.state?.feedback || ""
  );
  const [employeeName, setEmployeeName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [summaryStrengths, setSummaryStrengths] = useState<string[]>([]);
  const [summaryDevelopment, setSummaryDevelopment] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showImprovementSuggestions, setShowImprovementSuggestions] = useState<boolean>(false);
  
  // Mock data for previously saved feedback
  const [savedFeedback, setSavedFeedback] = useState<FeedbackSummary[]>([
    {
      id: "1",
      employeeName: "John Doe",
      date: "2023-06-10",
      rawFeedback: "John has been excellent at meeting deadlines and communicating with the team. His technical skills have improved significantly. However, he could work on documentation and mentoring junior team members.",
      summary: {
        strengths: [
          "Consistently meets deadlines",
          "Strong communication skills",
          "Improved technical proficiency"
        ],
        developmentAreas: [
          "Documentation needs improvement",
          "Could offer more mentoring to junior staff"
        ]
      }
    },
    {
      id: "2",
      employeeName: "Sarah Miller",
      date: "2023-06-15",
      rawFeedback: "Sarah demonstrates exceptional leadership on the design team. Her creativity and attention to detail stand out. She could benefit from more technical understanding of implementation constraints.",
      summary: {
        strengths: [
          "Exceptional leadership abilities",
          "Creative approach to problem-solving",
          "Strong attention to detail"
        ],
        developmentAreas: [
          "Limited understanding of technical constraints",
          "Could improve cross-team collaboration"
        ]
      }
    }
  ]);

  const handleGenerateSummary = async () => {
    if (!rawFeedback.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide feedback text to summarize.",
      });
      return;
    }

    if (!employeeName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter the employee name.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Call the Gemini API through our utility
      const result = await generateSummary(rawFeedback);
      
      if (result) {
        setSummaryStrengths(result.strengths);
        setSummaryDevelopment(result.developmentAreas);
        
        toast({
          title: "Summary generated",
          description: "AI has analyzed the feedback and created a summary.",
        });
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating the summary. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFeedback = () => {
    if (!employeeName.trim() || summaryStrengths.length === 0 || summaryDevelopment.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please complete all required fields before saving.",
      });
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call to save feedback
    setTimeout(() => {
      const newFeedback: FeedbackSummary = {
        id: Date.now().toString(),
        employeeName,
        date: new Date().toISOString().split('T')[0],
        rawFeedback,
        summary: {
          strengths: summaryStrengths,
          developmentAreas: summaryDevelopment,
        }
      };
      
      setSavedFeedback([newFeedback, ...savedFeedback]);
      
      toast({
        title: "Feedback saved",
        description: "The feedback and summary have been saved successfully.",
      });
      
      setIsSaving(false);
      
      // Clear form for new entry
      setRawFeedback("");
      setEmployeeName("");
      setSummaryStrengths([]);
      setSummaryDevelopment([]);
      setShowImprovementSuggestions(false);
    }, 1500);
  };

  const handleAddStrength = (newStrength: string) => {
    if (newStrength.trim()) {
      setSummaryStrengths([...summaryStrengths, newStrength.trim()]);
    }
  };

  const handleAddDevelopment = (newArea: string) => {
    if (newArea.trim()) {
      setSummaryDevelopment([...summaryDevelopment, newArea.trim()]);
    }
  };

  const handleRemoveStrength = (index: number) => {
    setSummaryStrengths(summaryStrengths.filter((_, i) => i !== index));
  };

  const handleRemoveDevelopment = (index: number) => {
    setSummaryDevelopment(summaryDevelopment.filter((_, i) => i !== index));
  };

  const filteredFeedback = savedFeedback.filter(feedback => 
    feedback.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.rawFeedback.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToHRMS = (feedbackId: string) => {
    // Simulate API call to export feedback to HRMS
    toast({
      title: "Exporting to HRMS",
      description: "The feedback is being exported to the HRMS system.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export successful",
        description: "The feedback has been successfully exported to HRMS.",
      });
    }, 2000);
  };

  const toggleImprovementSuggestions = () => {
    if (!showImprovementSuggestions && summaryDevelopment.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing development areas",
        description: "Please generate a feedback summary first to identify development areas.",
      });
      return;
    }
    
    setShowImprovementSuggestions(!showImprovementSuggestions);
  };

  return (
    <div className="container py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">AI-Powered Feedback Summary</h1>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Summary</TabsTrigger>
          <TabsTrigger value="history">View History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Summary</CardTitle>
              <CardDescription>
                Enter feedback text and employee details to generate an AI-powered summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  placeholder="Enter employee name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rawFeedback">Feedback Text</Label>
                <Textarea
                  id="rawFeedback"
                  placeholder="Enter or paste the raw feedback text here..."
                  className="min-h-[200px]"
                  value={rawFeedback}
                  onChange={(e) => setRawFeedback(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {rawFeedback.length} characters | {rawFeedback.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
              
              <Button 
                onClick={handleGenerateSummary}
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isGenerating || !rawFeedback.trim() || !employeeName.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Generate AI Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {(summaryStrengths.length > 0 || summaryDevelopment.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Summary</CardTitle>
                <CardDescription>
                  Review and edit the AI-generated summary before saving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Key Strengths</Label>
                    <div className="mt-2 space-y-2">
                      {summaryStrengths.map((strength, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{strength}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveStrength(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <NewItemDialog 
                        title="Add Strength"
                        label="Strength"
                        placeholder="Enter a key strength"
                        onAdd={handleAddStrength}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Development Areas</Label>
                    <div className="mt-2 space-y-2">
                      {summaryDevelopment.map((area, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{area}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveDevelopment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <NewItemDialog 
                        title="Add Development Area"
                        label="Development Area"
                        placeholder="Enter a development area"
                        onAdd={handleAddDevelopment}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={toggleImprovementSuggestions}
                  className="flex-1 min-w-[200px]"
                >
                  <BrainCircuit className="mr-2 h-4 w-4 text-orange-500" />
                  {showImprovementSuggestions ? "Hide Improvement Path" : "Generate Improvement Path"}
                </Button>
                <Button 
                  onClick={handleSaveFeedback}
                  className="flex-1 min-w-[200px] bg-orange-500 hover:bg-orange-600"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Feedback Summary
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <ImprovementSuggestions 
            employeeName={employeeName}
            developmentAreas={summaryDevelopment}
            isOpen={showImprovementSuggestions}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Feedback History</CardTitle>
              <CardDescription>
                Search and view previously saved feedback summaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name or feedback content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((feedback) => (
                    <Card key={feedback.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{feedback.employeeName}</CardTitle>
                            <CardDescription>
                              Date: {new Date(feedback.date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => exportToHRMS(feedback.id)}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Export to HRMS
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm">Original Feedback:</h4>
                            <p className="text-sm mt-1 text-gray-600">
                              {feedback.rawFeedback}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm">Key Strengths:</h4>
                              <ul className="mt-2 space-y-1">
                                {feedback.summary.strengths.map((strength, index) => (
                                  <li key={index} className="text-sm flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm">Development Areas:</h4>
                              <ul className="mt-2 space-y-1">
                                {feedback.summary.developmentAreas.map((area, index) => (
                                  <li key={index} className="text-sm flex items-start">
                                    <span className="text-orange-600 mr-2">•</span>
                                    {area}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setEmployeeName(feedback.employeeName);
                            setSummaryDevelopment(feedback.summary.developmentAreas);
                            setShowImprovementSuggestions(true);
                            toast({
                              title: "Feedback loaded",
                              description: `Ready to generate improvement suggestions for ${feedback.employeeName}`,
                            });
                            // Switch to create tab
                            document.querySelector('[data-state="inactive"][value="create"]')?.click();
                          }}
                        >
                          <BrainCircuit className="mr-2 h-4 w-4 text-orange-500" />
                          Generate Improvement Path
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No feedback records found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for adding new items to the summary
interface NewItemDialogProps {
  title: string;
  label: string;
  placeholder: string;
  onAdd: (item: string) => void;
}

const NewItemDialog = ({ title, label, placeholder, onAdd }: NewItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  
  const handleSubmit = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Edit className="h-4 w-4 mr-2" />
          Add {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add a new {label.toLowerCase()} to the feedback summary.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newItem">{label}</Label>
            <Input
              id="newItem"
              placeholder={placeholder}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600">
            Add {label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackSummary;
