import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Loader2, WifiOff, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Define the SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

// Extend the window interface
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Indian languages supported by speech recognition
const indianLanguages = [
  { code: 'en-IN', name: 'English (India)' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'ur-IN', name: 'Urdu' },
  { code: 'or-IN', name: 'Odia' }
];

const RecordFeedback = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(true);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const retryTimerRef = useRef(null);

  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      console.log("Network is online");
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log("Network is offline");
      setIsOnline(false);
      if (isListening) {
        stopRecording();
        toast({
          variant: "destructive",
          title: "Network Disconnected",
          description: "Speech recognition requires an internet connection."
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isListening, toast]);

  // Initialize speech recognition when component mounts or language changes
  useEffect(() => {
    console.log("Initializing speech recognition with language:", selectedLanguage);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      console.log("Speech recognition is supported in this browser");
      setIsSupportedBrowser(true);
      
      // Clean up any existing recognition instance
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event) => {
        console.log("Speech recognition result received", event.results);
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        console.log("Final transcript:", finalTranscript);
        console.log("Interim transcript:", interimTranscript);
        
        // Reset retry count when we get results
        setRetryCount(0);
        
        // Update transcribed text with final results
        if (finalTranscript) {
          setTranscribedText((prev) => {
            const newText = prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim();
            console.log("Updated transcribed text:", newText);
            return newText;
          });
        }
      };

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started successfully");
      };

      // Handle when speech recognition ends
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        // If we're still supposed to be listening, restart it
        if (isListening) {
          if (isOnline) {
            // Implement exponential backoff for retries
            const maxRetries = 3;
            if (retryCount < maxRetries) {
              const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
              console.log(`Retrying speech recognition in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
              
              clearTimeout(retryTimerRef.current);
              retryTimerRef.current = setTimeout(() => {
                try {
                  recognitionRef.current.start();
                  setRetryCount(prev => prev + 1);
                } catch (error) {
                  console.error('Error restarting speech recognition:', error);
                  setIsListening(false);
                  setIsRecording(false);
                  
                  toast({
                    variant: "destructive",
                    title: "Recognition Failed",
                    description: "Too many failed attempts. Please try again later.",
                  });
                }
              }, delay);
            } else {
              console.log("Max retries reached, stopping recording");
              setIsListening(false);
              setIsRecording(false);
              
              toast({
                variant: "destructive",
                title: "Recognition Failed",
                description: "Speech recognition failed after multiple attempts. Please try again later.",
              });
            }
          } else {
            console.log("Network is offline, not retrying");
            setIsListening(false);
            setIsRecording(false);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'network') {
          console.log("Network error detected in speech recognition");
          if (navigator.onLine) {
            toast({
              variant: "destructive",
              title: "Network Error",
              description: "Speech recognition service is unavailable. Check your connection or try again later.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Offline",
              description: "Speech recognition requires an internet connection.",
            });
          }
        } else if (event.error === 'language-not-supported') {
          toast({
            variant: "destructive",
            title: "Language Not Supported",
            description: `The selected language may not be fully supported by your browser.`,
          });
          setIsListening(false);
          setIsRecording(false);
        } else if (event.error !== 'no-speech') {
          // Only show toast for errors other than "no-speech"
          toast({
            variant: "destructive",
            title: "Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
          });
        }
        
        // Serious errors should stop recording completely
        if (['not-allowed', 'service-not-allowed', 'aborted', 'audio-capture', 'bad-grammar', 'language-not-supported'].includes(event.error)) {
          console.log(`Serious error: ${event.error}, stopping recording`);
          setIsListening(false);
          setIsRecording(false);
        }
      };
    } else {
      console.error("Speech recognition is NOT supported in this browser");
      setIsSupportedBrowser(false);
      toast({
        variant: "destructive",
        title: "Browser not supported",
        description: "Speech recognition is not supported in your browser.",
      });
    }

    return () => {
      console.log("Cleaning up speech recognition");
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [selectedLanguage, toast]); // Re-initialize when language changes

  // Update the timer functionality in a separate useEffect
  useEffect(() => {
    console.log("isListening changed:", isListening);
    if (isListening) {
      console.log("Starting timer");
      // Make sure to clear any existing timer first
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          console.log("Recording time updated:", prev + 1);
          return prev + 1;
        });
      }, 1000);
    } else {
      console.log("Stopping timer");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        console.log("Cleaning up timer");
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  // Handle language change
  const handleLanguageChange = (value) => {
    console.log("Language changed to:", value);
    
    // If currently recording, stop first
    if (isRecording) {
      stopRecording();
    }
    
    setSelectedLanguage(value);
    
    toast({
      title: "Language Changed",
      description: `Speech recognition language set to ${indianLanguages.find(lang => lang.code === value)?.name}.`,
    });
  };

  // Check for permission before starting
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the tracks immediately after permission is granted
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Microphone access is required for speech recognition.",
      });
      return false;
    }
  };

  // Real speech recognition
  const startRecording = async () => {
    console.log("Starting recording...");
    
    // Check if online first
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "Offline",
        description: "Speech recognition requires an internet connection.",
      });
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported");
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Speech recognition is not supported in your browser.",
      });
      return;
    }

    // Check microphone permission first
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) return;

    setIsRecording(true);
    setIsListening(true);
    setRecordingTime(0); // Reset the timer
    setRetryCount(0); // Reset retry counter

    try {
      console.log("Attempting to start speech recognition in language:", selectedLanguage);
      recognitionRef.current.lang = selectedLanguage; // Ensure correct language is set
      recognitionRef.current.start();
      
      const currentLang = indianLanguages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage;
      toast({
        title: "Recording started",
        description: `Speak clearly in ${currentLang} into your microphone.`,
      });
    } catch (error) {
      console.error('Speech recognition start error:', error);
      toast({
        variant: "destructive",
        title: "Recognition Error",
        description: "Could not start speech recognition. Please try again.",
      });
      setIsListening(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    setIsRecording(false);
    setIsListening(false);
    
    // Clear any pending retry timers
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        console.log("Stopping speech recognition");
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Speech recognition stop error:', error);
      }
    }

    toast({
      title: "Recording stopped",
      description: "Your speech has been processed and added to the feedback.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipient || !subject || !transcribedText) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Feedback submitted successfully",
        description: "Your feedback has been saved and sent to the recipient.",
      });
      
      // Reset form
      setTranscribedText("");
      setRecipient("");
      setSubject("");
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Record Feedback</h1>
      
      {!isOnline && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-center">
          <WifiOff className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">You're offline</p>
            <p className="text-sm">Speech recognition requires an internet connection. You can still type your feedback manually.</p>
          </div>
        </div>
      )}

      {!isSupportedBrowser && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-center">
          <WifiOff className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">Browser not supported</p>
            <p className="text-sm">Speech recognition is not supported in your browser. You can still type your feedback manually.</p>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>New Feedback</CardTitle>
          <CardDescription>
            Use voice recognition or type directly to provide your feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Select value={recipient} onValueChange={setRecipient} required>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product-team">Product Team</SelectItem>
                  <SelectItem value="design-team">Design Team</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="customer-support">Customer Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter feedback subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            {/* Language selection dropdown */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange} disabled={isRecording}>
                <SelectTrigger id="language" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {indianLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Note: Support for Indian languages varies by browser and device
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="feedback">Feedback</Label>
                <div className="flex items-center">
                  {isRecording && (
                    <div className="flex items-center text-orange-500 mr-3">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
                      <span>{formatTime(recordingTime)}</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? "border-red-500 text-red-500 hover:text-red-600 hover:border-red-600" : ""}
                    disabled={(!isOnline && !isRecording) || !isSupportedBrowser}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="feedback"
                  placeholder={`Record or type your feedback in ${indianLanguages.find(lang => lang.code === selectedLanguage)?.name || 'selected language'}...`}
                  className="min-h-[200px]"
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  required
                  dir={['ur-IN'].includes(selectedLanguage) ? 'rtl' : 'ltr'} // Right-to-left for Urdu
                />
                {selectedLanguage !== 'en-IN' && (
                  <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    {indianLanguages.find(lang => lang.code === selectedLanguage)?.name}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {transcribedText.length} characters | {transcribedText.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Save as Draft</Button>
          <Button 
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Feedback Tips</h2>
        <div className="bg-orange-50 p-4 rounded-lg space-y-2">
          <p className="text-sm">
            <strong>Be specific:</strong> Provide concrete examples to illustrate your points.
          </p>
          <p className="text-sm">
            <strong>Be constructive:</strong> Focus on behaviors and actions that can be improved, not personal criticisms.
          </p>
          <p className="text-sm">
            <strong>Be balanced:</strong> Include both strengths and areas for improvement in your feedback.
          </p>
          <p className="text-sm">
            <strong>Language support:</strong> For best results with Indian languages, speak clearly and at a moderate pace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecordFeedback;