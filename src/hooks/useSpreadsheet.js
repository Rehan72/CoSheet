// hooks/useSpreadsheet.js - FIXED TOTAL CALCULATION
import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpreadsheet = () => {
  const [data, setData] = useState([
    ['Product', 'Category', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales', 'Total'],
    ['Electronics', '', '', '', '', '', ''],
    ['MacBook Pro', 'Laptops', '15000', '18000', '22000', '25000', ''],
    ['iPhone 15', 'Phones', '22000', '25000', '28000', '30000', ''],
    ['iPad Air', 'Tablets', '8000', '9500', '11000', '12000', ''],
    ['Accessories', '', '', '', '', '', ''],
    ['AirPods', 'Audio', '5000', '6000', '7500', '9000', ''],
    ['Magic Mouse', 'Input', '3000', '3500', '4000', '4500', ''],
    ['USB-C Cable', 'Cables', '2000', '2500', '3000', '3500', ''],
    ['TOTAL', '', '', '', '', '', '']
  ]);

  const [selectedCell, setSelectedCell] = useState(null);
  const [formulas, setFormulas] = useState({});
  const [history, setHistory] = useState({ past: [], future: [] });
  const [clipboard, setClipboard] = useState(null);
  const [formatting, setFormatting] = useState({});

  // Use refs to avoid dependency issues
  const dataRef = useRef(data);
  const formulasRef = useRef(formulas);

  // Keep refs updated
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    formulasRef.current = formulas;
  }, [formulas]);

  const saveHistory = useCallback((newData) => {
    setHistory(prev => ({
      past: [...prev.past, dataRef.current],
      future: []
    }));
  }, []);

  // SIMPLIFIED formula evaluation that actually works
  const evaluateFormula = useCallback((formula, contextData, rowIndex, colIndex) => {
    try {
      if (!formula.startsWith('=')) return formula;
      
      let expression = formula.slice(1).trim();
      
      // Handle SUM function with simple range parsing
      if (expression.startsWith('SUM(')) {
        const range = expression.slice(4, -1);
        const [start, end] = range.split(':');
        
        if (start && end) {
          // Parse cell references like C3:F3
          const startCol = start.charCodeAt(0) - 65; // C -> 2
          const startRow = parseInt(start.slice(1)) - 1; // 3 -> 2
          const endCol = end.charCodeAt(0) - 65; // F -> 5
          const endRow = parseInt(end.slice(1)) - 1; // 3 -> 2
          
          let sum = 0;
          for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
              const value = contextData[row]?.[col] || '0';
              const numValue = parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
              sum += numValue;
            }
          }
          return sum.toLocaleString();
        }
      }

      // Handle column sums like SUM(C3:C9)
      if (expression.startsWith('SUM(') && expression.includes(':')) {
        const range = expression.slice(4, -1);
        const [start, end] = range.split(':');
        
        const startCol = start.charCodeAt(0) - 65;
        const startRow = parseInt(start.slice(1)) - 1;
        const endRow = parseInt(end.slice(1)) - 1;
        
        let sum = 0;
        for (let row = startRow; row <= endRow; row++) {
          const value = contextData[row]?.[startCol] || '0';
          const numValue = parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
          // Skip empty rows and header rows
          if (numValue > 0 && row > 0) {
            sum += numValue;
          }
        }
        return sum.toLocaleString();
      }

      return '#ERROR';
    } catch (error) {
      console.error('Formula error:', error);
      return '#ERROR';
    }
  }, []);

  // Calculate all totals automatically
  const calculateTotals = useCallback((currentData) => {
    const newData = currentData.map(row => [...row]);
    const numRows = newData.length;
    const numCols = newData[0]?.length || 0;

    // Calculate product totals (row totals)
    for (let row = 2; row < numRows - 1; row++) {
      if (newData[row] && newData[row][0] && newData[row][0].trim() !== '') {
        let rowTotal = 0;
        for (let col = 2; col < 6; col++) { // Columns C-F (Q1-Q4 Sales)
          const value = newData[row]?.[col] || '0';
          const numValue = parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
          rowTotal += numValue;
        }
        newData[row][6] = rowTotal.toLocaleString(); // Column G (Total)
      }
    }

    // Calculate quarterly totals (column totals)
    for (let col = 2; col < 6; col++) { // Columns C-F (Q1-Q4)
      let colTotal = 0;
      for (let row = 2; row < numRows - 1; row++) {
        if (newData[row] && newData[row][0] && newData[row][0].trim() !== '') {
          const value = newData[row]?.[col] || '0';
          const numValue = parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
          colTotal += numValue;
        }
      }
      newData[numRows - 1][col] = colTotal.toLocaleString(); // Last row (TOTAL)
    }

    // Calculate grand total
    let grandTotal = 0;
    for (let row = 2; row < numRows - 1; row++) {
      if (newData[row] && newData[row][0] && newData[row][0].trim() !== '') {
        const value = newData[row]?.[6] || '0';
        const numValue = parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
        grandTotal += numValue;
      }
    }
    newData[numRows - 1][6] = grandTotal.toLocaleString();

    return newData;
  }, []);

  // Optimized cell update with automatic total calculation
  const updateCell = useCallback((rowIndex, colIndex, value) => {
    setData(prevData => {
      const newData = prevData.map(row => [...row]);
      const newFormulas = { ...formulasRef.current };
      
      if (value.startsWith('=')) {
        // Store formula and evaluate immediately
        newFormulas[`${rowIndex}-${colIndex}`] = value;
        newData[rowIndex][colIndex] = evaluateFormula(value, newData, rowIndex, colIndex);
      } else {
        // Remove formula if it exists
        delete newFormulas[`${rowIndex}-${colIndex}`];
        newData[rowIndex][colIndex] = value;
      }
      
      // Update formulas state
      setFormulas(newFormulas);
      
      // Recalculate ALL totals whenever any data changes
      const dataWithTotals = calculateTotals(newData);
      
      // Save history after all updates
      saveHistory(dataWithTotals);
      
      return dataWithTotals;
    });
  }, [evaluateFormula, saveHistory, calculateTotals]);

  // Initialize totals on first load
  useEffect(() => {
    setData(prevData => calculateTotals(prevData));
  }, [calculateTotals]);

  const getCellValue = useCallback((rowIndex, colIndex) => {
    return data[rowIndex]?.[colIndex] || '';
  }, [data]);

  const addRow = useCallback(() => {
    setData(prev => {
      const newRow = Array(prev[0].length).fill('');
      const newData = [...prev.slice(0, -1), newRow, prev[prev.length - 1]]; // Keep TOTAL row at bottom
      const dataWithTotals = calculateTotals(newData);
      saveHistory(dataWithTotals);
      return dataWithTotals;
    });
  }, [saveHistory, calculateTotals]);

  const addColumn = useCallback(() => {
    setData(prev => {
      const newData = prev.map(row => [...row, '']);
      const dataWithTotals = calculateTotals(newData);
      saveHistory(dataWithTotals);
      return dataWithTotals;
    });
  }, [saveHistory, calculateTotals]);

  const deleteRow = useCallback(() => {
    if (selectedCell?.row !== undefined && selectedCell.row < data.length - 1 && selectedCell.row > 1) {
      setData(prev => {
        const newData = prev.filter((_, index) => index !== selectedCell.row);
        const dataWithTotals = calculateTotals(newData);
        saveHistory(dataWithTotals);
        return dataWithTotals;
      });
    }
  }, [selectedCell, data.length, saveHistory, calculateTotals]);

  const deleteColumn = useCallback(() => {
    if (selectedCell?.col !== undefined && selectedCell.col < data[0]?.length - 1 && selectedCell.col > 1) {
      setData(prev => {
        const newData = prev.map(row => row.filter((_, index) => index !== selectedCell.col));
        const dataWithTotals = calculateTotals(newData);
        saveHistory(dataWithTotals);
        return dataWithTotals;
    });
    }
  }, [selectedCell, data, saveHistory, calculateTotals]);

  const undo = useCallback(() => {
    if (history.past.length > 0) {
      const previous = history.past[history.past.length - 1];
      setHistory(prev => ({
        past: prev.past.slice(0, -1),
        future: [data, ...prev.future]
      }));
      setData(previous);
    }
  }, [history, data]);

  const redo = useCallback(() => {
    if (history.future.length > 0) {
      const next = history.future[0];
      setHistory(prev => ({
        past: [...prev.past, data],
        future: prev.future.slice(1)
      }));
      setData(next);
    }
  }, [history, data]);

  const searchData = useCallback((query) => {
    if (!query) return data;
    
    return data.map((row, rowIndex) => 
      row.map((cell, colIndex) => {
        const cellValue = cell.toString().toLowerCase();
        const searchTerm = query.toLowerCase();
        
        if (cellValue.includes(searchTerm)) {
          return cell;
        }
        return '';
      })
    );
  }, [data]);

  const clearCell = useCallback(() => {
    if (selectedCell) {
      updateCell(selectedCell.row, selectedCell.col, '');
    }
  }, [selectedCell, updateCell]);

  const copyCell = useCallback(() => {
    if (selectedCell) {
      setClipboard({
        value: data[selectedCell.row][selectedCell.col],
        row: selectedCell.row,
        col: selectedCell.col
      });
    }
  }, [selectedCell, data]);

  const pasteCell = useCallback(() => {
    if (selectedCell && clipboard) {
      updateCell(selectedCell.row, selectedCell.col, clipboard.value);
    }
  }, [selectedCell, clipboard, updateCell]);

  const applyFormatting = useCallback((formatType) => {
    if (selectedCell) {
      setFormatting(prev => ({
        ...prev,
        [`${selectedCell.row}-${selectedCell.col}`]: formatType
      }));
    }
  }, [selectedCell]);

  const sortData = useCallback((columnIndex, ascending = true) => {
    setData(prev => {
      const headers = prev[0];
      const totalRow = prev[prev.length - 1]; // Keep TOTAL row at bottom
      const dataRows = prev.slice(1, -1); // Exclude header and total
      
      const sortedRows = dataRows.sort((a, b) => {
        const valA = a[columnIndex] || '';
        const valB = b[columnIndex] || '';
        
        if (ascending) {
          return valA.toString().localeCompare(valB.toString());
        } else {
          return valB.toString().localeCompare(valA.toString());
        }
      });
      
      const newData = [headers, ...sortedRows, totalRow];
      const dataWithTotals = calculateTotals(newData);
      saveHistory(dataWithTotals);
      return dataWithTotals;
    });
  }, [saveHistory, calculateTotals]);

  const filterData = useCallback((columnIndex, filterValue) => {
    console.log(`Filter column ${columnIndex} with value: ${filterValue}`);
  }, []);

  const exportToExcel = useCallback(() => {
    const csvContent = data.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cosheet-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importFromExcel = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const rows = content.split('\n').map(row => 
            row.split(',').map(cell => cell.replace(/"/g, ''))
          );
          const dataWithTotals = calculateTotals(rows);
          setData(dataWithTotals);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [calculateTotals]);

  const reorderRow = useCallback((oldIndex, newIndex) => {
  // Don't allow reordering the TOTAL row (last row)
  if (oldIndex >= data.length - 1 || newIndex >= data.length - 1) {
    return;
  }

  setData(prev => {
    const newData = [...prev];
    const [movedRow] = newData.splice(oldIndex, 1);
    newData.splice(newIndex, 0, movedRow);
    
    const dataWithTotals = calculateTotals(newData);
    saveHistory(dataWithTotals);
    return dataWithTotals;
  });
}, [data.length, saveHistory, calculateTotals]);

const reorderColumn = useCallback((oldIndex, newIndex) => {
  // Don't allow reordering the TOTAL column (last column)
  if (oldIndex >= data[0]?.length - 1 || newIndex >= data[0]?.length - 1) {
    return;
  }

  setData(prev => {
    const newData = prev.map(row => {
      const newRow = [...row];
      const [movedCell] = newRow.splice(oldIndex, 1);
      newRow.splice(newIndex, 0, movedCell);
      return newRow;
    });
    
    const dataWithTotals = calculateTotals(newData);
    saveHistory(dataWithTotals);
    return dataWithTotals;
  });
}, [data, saveHistory, calculateTotals]);

  return {
    data,
    selectedCell,
    formulas,
    history,
    formatting,
    updateCell,
    setSelectedCell,
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    undo,
    redo,
    exportToExcel,
    importFromExcel,
    evaluateFormula,
    getCellValue,
    searchData,
    clearCell,
    copyCell,
    pasteCell,
    applyFormatting,
    sortData,
    filterData,
     reorderRow,
  reorderColumn,
  };
};