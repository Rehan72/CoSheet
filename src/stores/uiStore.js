import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  // UI State
  sidebarOpen: true,
  activeTab: 'login',
  theme: localStorage.getItem('app-theme') || 'light',
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
    const validTheme = (theme === 'dark' || theme === 'light') ? theme : 'light';
    set({ theme: validTheme });
    localStorage.setItem('app-theme', validTheme);
    // Also update document class for theme switching
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(validTheme);
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