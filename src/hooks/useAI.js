// hooks/useAI.js
import { useState } from 'react';
import { useCallback } from 'react';

export const useAI = ({ evaluateFormula, getCellValue, data }) => {
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const processAICommand = useCallback(async (command) => {
    setAiThinking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = '';
    
    // Simple command processing - in real app, integrate with OpenAI API
    if (command.toLowerCase().includes('sum') || command.toLowerCase().includes('total')) {
      const total = data.slice(1, -1).reduce((sum, row) => {
        return sum + row.slice(1).reduce((rowSum, cell) => {
          return rowSum + (parseFloat(cell) || 0);
        }, 0);
      }, 0);
      response = `The total sales across all products and quarters is $${total.toLocaleString()}`;
    } else if (command.toLowerCase().includes('average')) {
      const numbers = data.slice(1, -1).flatMap(row => 
        row.slice(1).map(cell => parseFloat(cell)).filter(val => !isNaN(val))
      );
      const average = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
      response = `The average quarterly sales per product is $${average.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    } else if (command.toLowerCase().includes('trend')) {
      response = `I can see an upward trend in sales across all products. Q4 shows the highest performance, with laptops showing the most significant growth.`;
    } else {
      response = `I've analyzed your data. You have ${data.length - 2} products with sales data across 4 quarters. The data shows consistent growth trends. Would you like me to perform any specific calculations?`;
    }
    
    setAiResponse(response);
    setAiThinking(false);
    
    return response;
  }, [data]);

  return {
    processAICommand,
    aiThinking,
    aiResponse
  };
};