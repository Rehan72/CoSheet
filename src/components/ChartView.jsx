// components/ChartView.jsx - UPDATED with working pie chart
import React, { useState, useMemo } from 'react';
import { BarChart, LineChart, PieChart, TrendingUp } from 'lucide-react';

const ChartView = ({ data }) => {
  const [chartType, setChartType] = useState('bar');

  // Process data for charts - FIXED VERSION
  const chartData = useMemo(() => {
    if (!data || data.length < 2) return { labels: [], datasets: [], products: [], totals: [] };

    const headers = data[0].slice(2, 6); // Q1, Q2, Q3, Q4 (columns C-F)
    
    // Get products (skip header, empty rows, and total row)
    const products = data.slice(1, -1)
      .filter(row => row[0] && row[0].trim() !== '') // Only rows with product names
      .map(row => row[0].trim());

    // Get quarterly data
    const quarterlyData = data.slice(1, -1)
      .filter(row => row[0] && row[0].trim() !== '')
      .map(row => 
        row.slice(2, 6).map(val => { // Columns C-F
          const cleanVal = val.toString().replace(/[$,]/g, '');
          return parseFloat(cleanVal) || 0;
        })
      );

    // Get totals from the last column (column G)
    const totals = data.slice(1, -1)
      .filter(row => row[0] && row[0].trim() !== '')
      .map(row => {
        const totalValue = row[6] || '0'; // Column G (Total)
        const cleanVal = totalValue.toString().replace(/[$,]/g, '');
        return parseFloat(cleanVal) || 0;
      });

    return {
      labels: headers,
      products,
      quarterlyData,
      totals,
      datasets: products.map((product, index) => ({
        label: product,
        data: quarterlyData[index],
        backgroundColor: `hsl(${index * 360 / products.length}, 70%, 50%)`,
        borderColor: `hsl(${index * 360 / products.length}, 70%, 40%)`,
        borderWidth: 2
      }))
    };
  }, [data]);

  // Render different chart types
  const renderChart = () => {
    if (!chartData.labels.length || chartData.products.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No chart data available</p>
          <p className="text-sm">Add some sales data to see charts</p>
        </div>
      );
    }

    if (chartType === 'pie') {
      return renderPieChart();
    }

    // Bar and Line charts
    const maxValue = Math.max(...chartData.datasets.flatMap(d => d.data));
    const chartHeight = 300;
    const barWidth = 40;
    const spacing = 20;

    return (
      <div className="h-96 overflow-auto">
        <svg width={chartData.labels.length * (barWidth + spacing) + 100} height={chartHeight + 100}>
          {/* Y-axis */}
          <line x1="50" y1="20" x2="50" y2={chartHeight + 20} stroke="#ccc" />
          
          {/* X-axis */}
          <line x1="50" y1={chartHeight + 20} x2={chartData.labels.length * (barWidth + spacing) + 50} y2={chartHeight + 20} stroke="#ccc" />
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <g key={index}>
              <line x1="45" y1={chartHeight + 20 - (ratio * chartHeight)} x2="50" y2={chartHeight + 20 - (ratio * chartHeight)} stroke="#ccc" />
              <text x="40" y={chartHeight + 20 - (ratio * chartHeight) + 4} textAnchor="end" fontSize="10" fill="#666">
                ${(ratio * maxValue / 1000).toFixed(0)}k
              </text>
            </g>
          ))}
          
          {/* Chart content */}
          {chartData.datasets.map((dataset, datasetIndex) =>
            chartData.labels.map((label, labelIndex) => {
              const value = dataset.data[labelIndex];
              const barHeight = (value / maxValue) * chartHeight;
              const x = 70 + labelIndex * (barWidth + spacing) + datasetIndex * (barWidth / chartData.datasets.length);
              const y = chartHeight + 20 - barHeight;

              return (
                <g key={`${datasetIndex}-${labelIndex}`}>
                  {chartType === 'bar' && (
                    <rect
                      x={x}
                      y={y}
                      width={barWidth / chartData.datasets.length}
                      height={barHeight}
                      fill={dataset.backgroundColor}
                    />
                  )}
                  {chartType === 'line' && labelIndex > 0 && (
                    <line
                      x1={70 + (labelIndex - 1) * (barWidth + spacing) + datasetIndex * (barWidth / chartData.datasets.length) + barWidth / (2 * chartData.datasets.length)}
                      y1={chartHeight + 20 - (dataset.data[labelIndex - 1] / maxValue) * chartHeight}
                      x2={x + barWidth / (2 * chartData.datasets.length)}
                      y2={y}
                      stroke={dataset.borderColor}
                      strokeWidth="2"
                    />
                  )}
                  {chartType === 'line' && (
                    <circle
                      cx={x + barWidth / (2 * chartData.datasets.length)}
                      cy={y}
                      r="4"
                      fill={dataset.backgroundColor}
                      stroke={dataset.borderColor}
                      strokeWidth="2"
                    />
                  )}
                  <text
                    x={x + barWidth / (2 * chartData.datasets.length)}
                    y={chartHeight + 40}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#666"
                  >
                    {label}
                  </text>
                </g>
              );
            })
          )}

          {/* Legend */}
          {chartData.datasets.map((dataset, index) => (
            <g key={index} transform={`translate(400, ${30 + index * 20})`}>
              <rect x="0" y="0" width="12" height="12" fill={dataset.backgroundColor} />
              <text x="20" y="10" fontSize="12" fill="#333">{dataset.label}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Render Pie Chart - FIXED VERSION
  const renderPieChart = () => {
    const total = chartData.totals.reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No data available for pie chart</p>
        </div>
      );
    }

    const centerX = 200;
    const centerY = 150;
    const radius = 100;
    let currentAngle = 0;

    return (
      <div className="h-96 flex items-center justify-center">
        <svg width="400" height="300">
          {chartData.totals.map((value, index) => {
            const percentage = value / total;
            const angle = percentage * 360;
            const endAngle = currentAngle + angle;
            
            if (percentage === 0) return null;
            
            // Convert angles to radians
            const startAngleRad = (currentAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            // Calculate coordinates
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            // Large arc flag
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const slice = (
              <g key={index}>
                <path
                  d={pathData}
                  fill={`hsl(${index * 360 / chartData.totals.length}, 70%, 50%)`}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Percentage label */}
                {percentage > 0.05 && ( // Only show label for slices > 5%
                  <text
                    x={centerX + (radius * 0.7) * Math.cos((currentAngle + angle / 2 - 90) * (Math.PI / 180))}
                    y={centerY + (radius * 0.7) * Math.sin((currentAngle + angle / 2 - 90) * (Math.PI / 180))}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#fff"
                    fontWeight="bold"
                  >
                    {`${(percentage * 100).toFixed(1)}%`}
                  </text>
                )}
              </g>
            );
            
            currentAngle = endAngle;
            return slice;
          })}
          
          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fontSize="14"
            fill="#333"
            fontWeight="bold"
          >
            Total
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            fontSize="16"
            fill="#333"
            fontWeight="bold"
          >
            ${(total / 1000).toFixed(0)}k
          </text>
        </svg>
        
        {/* Legend */}
        <div className="ml-8">
          <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
          <div className="space-y-2">
            {chartData.products.map((product, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: `hsl(${index * 360 / chartData.products.length}, 70%, 50%)` }}
                ></div>
                <span className="text-sm text-gray-700">{product}</span>
                <span className="text-sm text-gray-500 ml-2">
                  (${(chartData.totals[index] / 1000).toFixed(0)}k)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Data Visualization</h2>
        <div className="flex space-x-2">
          {[
            { type: 'bar', label: 'Bar Chart', icon: BarChart },
            { type: 'line', label: 'Line Chart', icon: LineChart },
            { type: 'pie', label: 'Pie Chart', icon: PieChart }
          ].map((chart) => (
            <button
              key={chart.type}
              onClick={() => setChartType(chart.type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                chartType === chart.type
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <chart.icon className="h-4 w-4" />
              <span>{chart.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartView;