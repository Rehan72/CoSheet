import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  // UI State
  sidebarOpen: true,
  activeTab: 'login',
  theme: 'light',
  isLoading: false,
  notifications: [],
  
  // UI Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  
  setTheme: (theme) => {
    set({ theme });
    // Also update document class for theme switching
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info',
      duration: 6000,
      ...notification
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto-remove notification after duration
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, newNotification.duration);
    
    return id;
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  }
}));

export default useUIStore;