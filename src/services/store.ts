import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definir tipos para el estado
interface ToolState {
  activeTools: string[];
  recentTools: string[];
  favorites: string[];
  toolsUsageCount: Record<string, number>;
  
  // Acciones
  addActiveTools: (tool: string) => void;
  removeActiveTool: (tool: string) => void;
  addRecentTool: (tool: string) => void;
  addToFavorites: (tool: string) => void;
  removeFromFavorites: (tool: string) => void;
  incrementToolUsage: (tool: string) => void;
  clearRecentTools: () => void;
}

// Crear store con persistencia
export const useToolStore = create<ToolState>()(
  persist(
    (set) => ({
      activeTools: [],
      recentTools: [],
      favorites: [],
      toolsUsageCount: {},
      
      addActiveTools: (tool) => 
        set((state) => ({
          activeTools: state.activeTools.includes(tool) 
            ? state.activeTools 
            : [...state.activeTools, tool]
        })),
        
      removeActiveTool: (tool) =>
        set((state) => ({
          activeTools: state.activeTools.filter((t) => t !== tool)
        })),
        
      addRecentTool: (tool) =>
        set((state) => {
          // Mantener solo las 10 herramientas más recientes
          const filteredRecent = state.recentTools.filter((t) => t !== tool);
          return {
            recentTools: [tool, ...filteredRecent].slice(0, 10)
          };
        }),
        
      addToFavorites: (tool) =>
        set((state) => ({
          favorites: state.favorites.includes(tool)
            ? state.favorites
            : [...state.favorites, tool]
        })),
        
      removeFromFavorites: (tool) =>
        set((state) => ({
          favorites: state.favorites.filter((t) => t !== tool)
        })),
        
      incrementToolUsage: (tool) =>
        set((state) => ({
          toolsUsageCount: {
            ...state.toolsUsageCount,
            [tool]: (state.toolsUsageCount[tool] || 0) + 1
          }
        })),
        
      clearRecentTools: () =>
        set({ recentTools: [] })
    }),
    {
      name: 'genia-tools-storage',
    }
  )
);

// Store para gestionar el estado de la UI
interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  currentView: string;
  
  // Acciones
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setCurrentView: (view: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      currentView: 'dashboard',
      
      toggleSidebar: () => 
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        
      toggleDarkMode: () => 
        set((state) => {
          const newDarkMode = !state.darkMode;
          
          // Aplicar clase al documento
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          return { darkMode: newDarkMode };
        }),
        
      setCurrentView: (view) => 
        set({ currentView: view })
    }),
    {
      name: 'genia-ui-storage',
      onRehydrateStorage: (state) => {
        // Aplicar modo oscuro al cargar
        if (state && state.darkMode) {
          document.documentElement.classList.add('dark');
        }
      }
    }
  )
);

// Store para gestionar el estado de los créditos y plan del usuario
interface UserPlanState {
  credits: number;
  plan: string;
  planExpiry: string | null;
  
  // Acciones
  setCredits: (credits: number) => void;
  decrementCredits: (amount: number) => void;
  incrementCredits: (amount: number) => void;
  setPlan: (plan: string, expiry?: string) => void;
}

export const useUserPlanStore = create<UserPlanState>()((set) => ({
  credits: 0,
  plan: 'free',
  planExpiry: null,
  
  setCredits: (credits) => 
    set({ credits }),
    
  decrementCredits: (amount) => 
    set((state) => ({ 
      credits: Math.max(0, state.credits - amount) 
    })),
    
  incrementCredits: (amount) => 
    set((state) => ({ 
      credits: state.credits + amount 
    })),
    
  setPlan: (plan, expiry = null) => 
    set({ plan, planExpiry: expiry })
}));
