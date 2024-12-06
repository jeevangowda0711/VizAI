import React, { useState } from 'react';
import API from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Component for configuring and displaying visualizations.
 */

function VisualizationConfigAndDisplay() {
  const [datasetId, setDatasetId] = useState('');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [visualization, setVisualization] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/visualizations/create', {
        user_id: 1,  // Replace with the actual user ID
        chart_type: chartType,
        config_data: JSON.stringify({ dataset_id: datasetId, x_column: xColumn, y_column: yColumn }),
      });
      setVisualization(response.data);
      console.log('Visualization created:', response.data);
    } catch (error) {
      console.error('Visualization creation failed:', error);
    }
  };

  const renderChart = () => {
    if (!visualization) return null;

    const config = JSON.parse(visualization.config_data);
    const data = {
      labels: config.labels || [],  // Ensure labels are part of the config_data
      datasets: [
        {
          label: visualization.chart_type,
          data: config.data || [],  // Ensure data is part of the config_data
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    let ChartComponent;
    switch (visualization.chart_type) {
      case 'bar':
        ChartComponent = Bar;
        break;
      case 'line':
        ChartComponent = Line;
        break;
      case 'pie':
        ChartComponent = Pie;
        break;
      default:
        return <div>Unsupported chart type</div>;
    }

    return <ChartComponent data={data} />;
  };

  return (
    <div>
      <h2>Configure Visualization</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dataset ID:</label>
          <input type="text" value={datasetId} onChange={(e) => setDatasetId(e.target.value)} required />
        </div>
        <div>
          <label>X Column:</label>
          <input type="text" value={xColumn} onChange={(e) => setXColumn(e.target.value)} required />
        </div>
        <div>
          <label>Y Column:</label>
          <input type="text" value={yColumn} onChange={(e) => setYColumn(e.target.value)} required />
        </div>
        <div>
          <label>Chart Type:</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        <button type="submit">Create Visualization</button>
      </form>
      {renderChart()}
    </div>
  );
}

export default VisualizationConfigAndDisplay;