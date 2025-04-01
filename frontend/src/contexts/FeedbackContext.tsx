import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our feedback items
export interface PendingFeedback {
  id: number;
  requestedBy: string;
  requestedFor: string;
  dueDate: string;
}

export interface FeedbackItem {
  id: number;
  recipient: string;
  topic: string;
  date: string;
  status: "Submitted" | "Draft";
}

// Context shape
interface FeedbackContextType {
  pendingFeedback: PendingFeedback[];
  recentFeedback: FeedbackItem[];
  feedbackStats: {
    pending: number;
    provided: number;
    received: number;
  };
  removePendingFeedback: (id: number) => void;
  updateRecentFeedback: (feedbackItem: FeedbackItem) => void;
  addRecentFeedback: (feedbackItem: FeedbackItem) => void;
  submitDraft: (id: number) => void;
  resetState: () => void;
}

// Initial data
const initialPendingFeedback = [
  { id: 1, requestedBy: "Sarah Chen", requestedFor: "Product Team", dueDate: "2023-07-25" },
  { id: 2, requestedBy: "Michael Johnson", requestedFor: "Marketing Campaign", dueDate: "2023-07-28" },
];

const initialRecentFeedback = [
  { id: 101, recipient: "Design Team", topic: "Website Redesign", date: "2023-07-15", status: "Submitted" as const },
  { id: 102, recipient: "Project Alpha", topic: "Sprint Retrospective", date: "2023-07-10", status: "Submitted" as const },
  { id: 103, recipient: "New Initiative", topic: "Initial Thoughts", date: "2023-07-05", status: "Draft" as const },
];

const initialFeedbackStats = {
  pending: initialPendingFeedback.length,
  provided: initialRecentFeedback.filter(f => f.status === "Submitted").length,
  received: 8, // Initial static value
};

// Create context with default value
const FeedbackContext = createContext<FeedbackContextType>({
  pendingFeedback: initialPendingFeedback,
  recentFeedback: initialRecentFeedback,
  feedbackStats: initialFeedbackStats,
  removePendingFeedback: () => {},
  updateRecentFeedback: () => {},
  addRecentFeedback: () => {},
  submitDraft: () => {},
  resetState: () => {},
});

// Context provider component
export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>(initialPendingFeedback);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>(initialRecentFeedback);
  const [feedbackStats, setFeedbackStats] = useState(initialFeedbackStats);

  // Remove a pending feedback request (after responding to it)
  const removePendingFeedback = (id: number) => {
    setPendingFeedback(pendingFeedback.filter(item => item.id !== id));
    setFeedbackStats(prev => ({
      ...prev,
      pending: prev.pending - 1
    }));
  };

  // Update a feedback item (for example, converting from draft to submitted)
  const updateRecentFeedback = (updatedItem: FeedbackItem) => {
    const wasSubmittedBefore = recentFeedback.find(f => f.id === updatedItem.id)?.status === "Submitted";
    const isSubmittedNow = updatedItem.status === "Submitted";
    
    setRecentFeedback(
      recentFeedback.map(item => item.id === updatedItem.id ? updatedItem : item)
    );

    // Update stats if status changed from draft to submitted
    if (!wasSubmittedBefore && isSubmittedNow) {
      setFeedbackStats(prev => ({
        ...prev,
        provided: prev.provided + 1
      }));
    }
  };

  // Add a new feedback item (when creating new feedback)
  const addRecentFeedback = (newItem: FeedbackItem) => {
    setRecentFeedback([newItem, ...recentFeedback]);
    
    if (newItem.status === "Submitted") {
      setFeedbackStats(prev => ({
        ...prev,
        provided: prev.provided + 1
      }));
    }
  };

  // Convert a draft to a submitted feedback
  const submitDraft = (id: number) => {
    const feedbackToUpdate = recentFeedback.find(item => item.id === id);
    if (feedbackToUpdate && feedbackToUpdate.status === "Draft") {
      updateRecentFeedback({
        ...feedbackToUpdate,
        status: "Submitted",
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Reset state to initial values (useful for testing or demo)
  const resetState = () => {
    setPendingFeedback(initialPendingFeedback);
    setRecentFeedback(initialRecentFeedback);
    setFeedbackStats(initialFeedbackStats);
  };

  return (
    <FeedbackContext.Provider value={{
      pendingFeedback,
      recentFeedback,
      feedbackStats,
      removePendingFeedback,
      updateRecentFeedback,
      addRecentFeedback,
      submitDraft,
      resetState
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook to use the feedback context
export const useFeedback = () => useContext(FeedbackContext);
