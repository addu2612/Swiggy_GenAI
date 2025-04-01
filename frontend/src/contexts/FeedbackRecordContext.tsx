import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import feedbackRecordService from '../../services/feedbackRecordService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface FeedbackSummary {
  strengths: string[];
  developmentAreas: string[];
}

export interface ImprovementSuggestion {
  suggestions: string[];
  resources: string[];
  timeframe: string;
}

export interface FeedbackRecord {
  _id?: string;
  employeeName: string;
  employeeRole?: string;
  rawFeedback: string;
  summary: FeedbackSummary;
  improvementSuggestions?: ImprovementSuggestion | null;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  hrmsExported?: boolean;
  hrmsExportedAt?: string | null;
  tags?: string[];
}

interface SearchFilters {
  searchTerm?: string;
  employeeName?: string;
  startDate?: string;
  endDate?: string;
  isExported?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface SearchResult {
  records: FeedbackRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface FeedbackRecordContextType {
  records: FeedbackRecord[];
  loading: boolean;
  searchResult: SearchResult | null;
  saveFeedbackRecord: (record: FeedbackRecord) => Promise<FeedbackRecord>;
  searchRecords: (filters?: SearchFilters) => Promise<void>;
  getRecordById: (id: string) => Promise<FeedbackRecord>;
  updateRecord: (id: string, data: Partial<FeedbackRecord>) => Promise<FeedbackRecord>;
  deleteRecord: (id: string) => Promise<boolean>;
  exportToHRMS: (id: string) => Promise<boolean>;
}

const FeedbackRecordContext = createContext<FeedbackRecordContextType | undefined>(undefined);

export const FeedbackRecordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // Load initial records on component mount
  useEffect(() => {
    if (user) {
      searchRecords();
    }
  }, [user]);

  const saveFeedbackRecord = async (record: FeedbackRecord): Promise<FeedbackRecord> => {
    setLoading(true);
    try {
      const response = await feedbackRecordService.createFeedbackRecord(record);
      
      if (response.success) {
        toast({
          title: "Feedback saved",
          description: "The feedback record has been saved successfully."
        });
        // Refresh records
        await searchRecords();
        return response.data;
      } else {
        throw new Error(response.message || "Failed to save feedback record");
      }
    } catch (error) {
      console.error("Error saving feedback record:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "An error occurred while saving the feedback record."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchRecords = async (filters?: SearchFilters): Promise<void> => {
    setLoading(true);
    try {
      const response = await feedbackRecordService.searchFeedbackRecords(filters);
      
      if (response.success) {
        setSearchResult(response.data);
        setRecords(response.data.records);
      } else {
        throw new Error(response.message || "Failed to search feedback records");
      }
    } catch (error) {
      console.error("Error searching feedback records:", error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: error.message || "An error occurred while searching feedback records."
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecordById = async (id: string): Promise<FeedbackRecord> => {
    setLoading(true);
    try {
      const response = await feedbackRecordService.getFeedbackRecordById(id);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to get feedback record");
      }
    } catch (error) {
      console.error(`Error getting feedback record ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Retrieval failed",
        description: error.message || "An error occurred while getting the feedback record."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (id: string, data: Partial<FeedbackRecord>): Promise<FeedbackRecord> => {
    setLoading(true);
    try {
      const response = await feedbackRecordService.updateFeedbackRecord(id, data);
      
      if (response.success) {
        toast({
          title: "Feedback updated",
          description: "The feedback record has been updated successfully."
        });
        
        // Update local state
        setRecords(prevRecords => 
          prevRecords.map(record => 
            record._id === id ? { ...record, ...data } : record
          )
        );
        
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update feedback record");
      }
    } catch (error) {
      console.error(`Error updating feedback record ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An error occurred while updating the feedback record."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await feedbackRecordService.deleteFeedbackRecord(id);
      
      if (response.success) {
        toast({
          title: "Feedback deleted",
          description: "The feedback record has been deleted successfully."
        });
        
        // Update local state
        setRecords(prevRecords => prevRecords.filter(record => record._id !== id));
        
        return true;
      } else {
        throw new Error(response.message || "Failed to delete feedback record");
      }
    } catch (error) {
      console.error(`Error deleting feedback record ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "An error occurred while deleting the feedback record."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportToHRMS = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await feedbackRecordService.exportToHRMS(id);
      
      if (response.success) {
        toast({
          title: "Export successful",
          description: "The feedback record has been exported to HRMS successfully."
        });
        
        // Update local state
        setRecords(prevRecords => 
          prevRecords.map(record => 
            record._id === id 
              ? { ...record, hrmsExported: true, hrmsExportedAt: new Date().toISOString() } 
              : record
          )
        );
        
        return true;
      } else {
        throw new Error(response.message || "Failed to export feedback record to HRMS");
      }
    } catch (error) {
      console.error(`Error exporting feedback record ${id} to HRMS:`, error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error.message || "An error occurred while exporting the feedback record to HRMS."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedbackRecordContext.Provider value={{
      records,
      loading,
      searchResult,
      saveFeedbackRecord,
      searchRecords,
      getRecordById,
      updateRecord,
      deleteRecord,
      exportToHRMS
    }}>
      {children}
    </FeedbackRecordContext.Provider>
  );
};

export const useFeedbackRecords = () => {
  const context = useContext(FeedbackRecordContext);
  if (context === undefined) {
    throw new Error("useFeedbackRecords must be used within a FeedbackRecordProvider");
  }
  return context;
};
