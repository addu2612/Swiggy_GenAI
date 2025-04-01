
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, BookOpen, Clock, Share2 } from "lucide-react";
import { generateImprovementSuggestions } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

interface ImprovementSuggestionsProps {
  employeeName: string;
  developmentAreas: string[];
  isOpen: boolean;
}

const ImprovementSuggestions = ({ employeeName, developmentAreas, isOpen }: ImprovementSuggestionsProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [role, setRole] = useState("Employee");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState("");

  const handleGenerateSuggestions = async () => {
    if (developmentAreas.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "No development areas found. Please generate a feedback summary first.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateImprovementSuggestions(developmentAreas, employeeName, role);
      
      setSuggestions(result.suggestions);
      setResources(result.resources);
      setTimeframe(result.timeframe);
      
      toast({
        title: "Improvement plan generated",
        description: "AI has created personalized improvement suggestions.",
      });
    } catch (error) {
      console.error("Error generating improvement suggestions:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating the improvement plan. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
          AI Improvement Path
        </CardTitle>
        <CardDescription>
          Generate personalized improvement suggestions based on feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Employee Name</div>
            <div className="text-sm text-muted-foreground">{employeeName}</div>
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateSuggestions}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Recommended Timeframe: {timeframe}</span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-orange-500" />
                Action Items
              </h4>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="bg-orange-50 p-3 rounded-md">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-orange-500" />
                Recommended Resources
              </h4>
              <ul className="space-y-2">
                {resources.map((resource, index) => (
                  <li key={index} className="p-2 border-l-2 border-orange-300 pl-3">
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      {suggestions.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <Share2 className="h-4 w-4 mr-2" />
            Share with Employee
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ImprovementSuggestions;
