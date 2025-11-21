import { create } from 'zustand';
import { getRequest, postRequest } from '../services/AxiosBaseService';

const useDashboardStore = create((set, get) => ({
  // Dashboard State
  data: [],
  stats: {},
  loading: false,
  error: null,
  
  // Dashboard Actions
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    
    try {
      const data = await getRequest("dashboard/data");
      set({ 
        data: data.data || [],
        stats: data.stats || {},
        loading: false 
      });
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch dashboard data";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  updateStats: (newStats) => {
    set((state) => ({
      stats: { ...state.stats, ...newStats }
    }));
  },
  
  addDataPoint: (dataPoint) => {
    set((state) => ({
      data: [...state.data, dataPoint]
    }));
  },
  
  removeDataPoint: (id) => {
    set((state) => ({
      data: state.data.filter(item => item.id !== id)
    }));
  },
  
  updateDataPoint: (id, updates) => {
    set((state) => ({
      data: state.data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },
  
  clearData: () => {
    set({ data: [], stats: {}, error: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useDashboardStore;