import { create } from 'zustand';

// Types for our feedback data
export interface FeedbackRequest {
  id: number;
  requestedBy: string;
  requestedFor: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  completedDate?: string;
}

interface FeedbackData {
  pendingRequests: FeedbackRequest[];
  completedRequests: FeedbackRequest[];
  activeUsers: number;
  completionRate: number;
}

interface FeedbackStore {
  data: FeedbackData;
  updateRequest: (requestId: number, status: 'completed') => void;
  addFeedback: (feedback: Omit<FeedbackRequest, 'id' | 'status'>) => void;
  getPendingCount: () => number;
  getCompletedCount: () => number;
}

// Initialize with mock data
const initialData: FeedbackData = {
  pendingRequests: [
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
  ],
  completedRequests: [
    {
      id: 101,
      requestedBy: "Alex Johnson",
      requestedFor: "Q1 Performance Review",
      assignedTo: "John Doe",
      dueDate: "2023-06-10",
      completedDate: "2023-06-15",
      status: "completed",
    },
    {
      id: 102,
      requestedBy: "Taylor Swift",
      requestedFor: "Website Redesign Feedback",
      assignedTo: "Jane Smith",
      dueDate: "2023-06-25",
      completedDate: "2023-06-28",
      status: "completed",
    },
    {
      id: 103,
      requestedBy: "Jordan Lee",
      requestedFor: "New Product Feature",
      assignedTo: "Robert Johnson",
      dueDate: "2023-07-01",
      completedDate: "2023-07-05",
      status: "completed",
    },
  ],
  activeUsers: 24,
  completionRate: 78,
};

// Create a store
export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  data: initialData,
  
  // Update a request status
  updateRequest: (requestId: number, status: 'completed') => {
    set((state) => {
      // Find the request to update
      const requestIndex = state.data.pendingRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) return state;
      
      // Get the request
      const request = state.data.pendingRequests[requestIndex];
      
      // Create updated request with completed status
      const updatedRequest: FeedbackRequest = {
        ...request,
        status: 'completed',
        completedDate: new Date().toISOString(),
      };
      
      // Create new arrays
      const newPendingRequests = [...state.data.pendingRequests];
      newPendingRequests.splice(requestIndex, 1);
      
      const newCompletedRequests = [updatedRequest, ...state.data.completedRequests];
      
      // Calculate new completion rate
      const total = newCompletedRequests.length + newPendingRequests.length;
      const newCompletionRate = Math.round((newCompletedRequests.length / total) * 100);
      
      return {
        data: {
          ...state.data,
          pendingRequests: newPendingRequests,
          completedRequests: newCompletedRequests,
          completionRate: newCompletionRate,
        }
      };
    });
  },
  
  // Add a new feedback request
  addFeedback: (feedback) => {
    set((state) => {
      const newId = state.data.pendingRequests.length > 0 
        ? Math.max(...state.data.pendingRequests.map(r => r.id)) + 1 
        : 1;
        
      const newRequest: FeedbackRequest = {
        ...feedback,
        id: newId,
        status: 'pending',
      };
      
      return {
        data: {
          ...state.data,
          pendingRequests: [newRequest, ...state.data.pendingRequests],
        }
      };
    });
  },
  
  // Get counts for dashboard
  getPendingCount: () => get().data.pendingRequests.length,
  getCompletedCount: () => get().data.completedRequests.length,
}));
