import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSpreadsheetStore = create(
  persist(
    (set, get) => ({
      // Spreadsheet State
      sheets: {},
      activeSheet: null,
      selectedCell: null,
      clipboard: null,
      undoStack: [],
      redoStack: [],
      maxHistorySize: 50,
      
      // Spreadsheet Actions
      createSheet: (name, data = []) => {
        const id = Date.now().toString();
        const newSheet = {
          id,
          name,
          data,
          columns: [],
          rows: [],
          lastModified: Date.now()
        };
        
        set((state) => ({
          sheets: { ...state.sheets, [id]: newSheet },
          activeSheet: id
        }));
        
        return id;
      },
      
      setActiveSheet: (id) => {
        set({ activeSheet: id });
      },
      
      updateCell: (row, col, value) => {
        set((state) => {
          if (!state.activeSheet) return state;
          
          const currentSheet = state.sheets[state.activeSheet];
          const newData = [...currentSheet.data];
          
          // Ensure the row exists
          if (!newData[row]) {
            newData[row] = [];
          }
          
          // Save current state for undo
          const currentValue = newData[row]?.[col];
          const previousState = JSON.parse(JSON.stringify(currentSheet));
          
          // Update the cell
          newData[row][col] = value;
          
          // Add to undo stack
          const newUndoStack = [
            ...state.undoStack,
            {
              type: 'cellUpdate',
              sheetId: state.activeSheet,
              row,
              col,
              previousValue: currentValue,
              newValue: value,
              timestamp: Date.now()
            }
          ].slice(-state.maxHistorySize);
          
          return {
            sheets: {
              ...state.sheets,
              [state.activeSheet]: {
                ...currentSheet,
                data: newData,
                lastModified: Date.now()
              }
            },
            undoStack: newUndoStack,
            redoStack: [] // Clear redo stack when new action is performed
          };
        });
      },
      
      selectCell: (row, col) => {
        set({ selectedCell: { row, col } });
      },
      
      copyCell: (row, col) => {
        const state = get();
        if (!state.activeSheet) return;
        
        const currentSheet = state.sheets[state.activeSheet];
        const value = currentSheet.data[row]?.[col];
        set({ clipboard: value });
      },
      
      pasteCell: (row, col) => {
        const state = get();
        if (!state.activeSheet || state.clipboard === null) return;
        
        get().updateCell(row, col, state.clipboard);
      },
      
      undo: () => {
        const state = get();
        if (state.undoStack.length === 0) return;
        
        const lastAction = state.undoStack[state.undoStack.length - 1];
        const newUndoStack = state.undoStack.slice(0, -1);
        
        if (lastAction.type === 'cellUpdate') {
          // Revert the cell to its previous value
          set((currentState) => {
            const currentSheet = currentState.sheets[lastAction.sheetId];
            const newData = [...currentSheet.data];
            newData[lastAction.row][lastAction.col] = lastAction.previousValue;
            
            return {
              sheets: {
                ...currentState.sheets,
                [lastAction.sheetId]: {
                  ...currentSheet,
                  data: newData
                }
              },
              undoStack: newUndoStack,
              redoStack: [
                ...currentState.redoStack,
                lastAction
              ].slice(-currentState.maxHistorySize)
            };
          });
        }
      },
      
      redo: () => {
        const state = get();
        if (state.redoStack.length === 0) return;
        
        const lastAction = state.redoStack[state.redoStack.length - 1];
        const newRedoStack = state.redoStack.slice(0, -1);
        
        if (lastAction.type === 'cellUpdate') {
          // Apply the cell update again
          set((currentState) => {
            const currentSheet = currentState.sheets[lastAction.sheetId];
            const newData = [...currentSheet.data];
            newData[lastAction.row][lastAction.col] = lastAction.newValue;
            
            return {
              sheets: {
                ...currentState.sheets,
                [lastAction.sheetId]: {
                  ...currentSheet,
                  data: newData
                }
              },
              undoStack: [
                ...currentState.undoStack,
                lastAction
              ].slice(-currentState.maxHistorySize),
              redoStack: newRedoStack
            };
          });
        }
      },
      
      deleteSheet: (id) => {
        set((state) => {
          const newSheets = { ...state.sheets };
          delete newSheets[id];
          
          const newActiveSheet = state.activeSheet === id ? null : state.activeSheet;
          
          return {
            sheets: newSheets,
            activeSheet: newActiveSheet
          };
        });
      },
      
      renameSheet: (id, name) => {
        set((state) => ({
          sheets: {
            ...state.sheets,
            [id]: {
              ...state.sheets[id],
              name,
              lastModified: Date.now()
            }
          }
        }));
      },
      
      clearSpreadsheet: () => {
        set({
          sheets: {},
          activeSheet: null,
          selectedCell: null,
          clipboard: null,
          undoStack: [],
          redoStack: []
        });
      }
    }),
    {
      name: 'spreadsheet-storage',
      partialize: (state) => ({
        sheets: state.sheets,
        activeSheet: state.activeSheet
      })
    }
  )
);

export default useSpreadsheetStore;