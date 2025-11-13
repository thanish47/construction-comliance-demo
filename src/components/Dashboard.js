import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AgCharts } from 'ag-charts-react';

const Dashboard = () => {
  const { mainShifted } = useOutletContext();

  // Chart 1: Residency Goal - Bar Chart
  const residencyGoalOptions = {
    title: {
      text: 'Residency Goal',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4a1f'
    },
    data: [
      { category: 'Goal', percentage: 50 },
      { category: 'Actual', percentage: 45 }
    ],
    series: [
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'percentage',
        yName: 'Percentage',
        itemStyler: ({ datum }) => {
          const colors = {
            'Goal': { fill: '#2A5FE5', stroke: '#1F4FC0' },
            'Actual': { fill: '#3FD9E6', stroke: '#1DC0CD' }
          };
          return colors[datum.category] || { fill: '#2A5FE5', stroke: '#1F4FC0' };
        },
        strokeWidth: 2,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Category',
          color: '#2d4a1f'
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f'
        },
        min: 0,
        max: 100,
        interval: 5
      }
    ]
  };

  // Chart 2: Female Workforce - Donut Chart
  const femaleWorkforceOptions = {
    title: {
      text: 'Female Workforce',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4a1f'
    },
    data: [
      { category: 'Goal', percentage: 45 },
      { category: 'Actual', percentage: 42 }
    ],
    series: [
      {
        type: 'donut',
        angleKey: 'percentage',
        calloutLabelKey: 'category',
        innerRadiusRatio: 0.6,
        fills: ['#8A52E6', '#3EBC8D'],
        strokes: ['#6D38C0', '#2DA176'],
        strokeWidth: 2,
        calloutLabel: {
          enabled: true
        },
        sectorLabel: {
          enabled: true,
          formatter: ({ value }) => `${value}%`
        }
      }
    ]
  };

  // Chart 3: Race Workforce - Pie Chart
  const raceWorkforceOptions = {
    title: {
      text: 'Race Workforce Distribution',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4a1f'
    },
    data: [
      { race: 'African American', percentage: 30 },
      { race: 'Caucasian', percentage: 45 },
      { race: 'Hispanic', percentage: 20 },
      { race: 'Native American', percentage: 5 }
    ],
    series: [
      {
        type: 'pie',
        angleKey: 'percentage',
        calloutLabelKey: 'race',
        fills: ['#2A5FE5', '#3FD9E6', '#8A52E6', '#E6A041'],
        strokes: ['#1F4FC0', '#1DC0CD', '#6D38C0', '#CD892E'],
        strokeWidth: 2,
        calloutLabel: {
          enabled: true
        },
        sectorLabel: {
          enabled: true,
          formatter: ({ value }) => `${value}%`
        }
      }
    ]
  };

  // Chart 4: Minority Workforce - Donut Chart
  const minorityWorkforceOptions = {
    title: {
      text: 'Minority Workforce',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4a1f'
    },
    data: [
      { category: 'Goal', percentage: 55 },
      { category: 'Actual', percentage: 52 }
    ],
    series: [
      {
        type: 'donut',
        angleKey: 'percentage',
        calloutLabelKey: 'category',
        innerRadiusRatio: 0.6,
        fills: ['#E6A041', '#3EBC8D'],
        strokes: ['#CD892E', '#2DA176'],
        strokeWidth: 2,
        calloutLabel: {
          enabled: true
        },
        sectorLabel: {
          enabled: true,
          formatter: ({ value }) => `${value}%`
        }
      }
    ]
  };

  // Chart 5: MBE Goal - Bar Chart
  const mbeGoalOptions = {
    title: {
      text: 'MBE (Minority Business Enterprise) Goal',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4a1f'
    },
    data: [
      { category: 'Goal', percentage: 35 },
      { category: 'Commitment', percentage: 30 },
      { category: 'Actual', percentage: 28 }
    ],
    series: [
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'percentage',
        yName: 'Percentage',
        itemStyler: ({ datum }) => {
          const colors = {
            'Goal': { fill: '#2A5FE5', stroke: '#1F4FC0' },
            'Commitment': { fill: '#8A52E6', stroke: '#6D38C0' },
            'Actual': { fill: '#3EBC8D', stroke: '#2DA176' }
          };
          return colors[datum.category] || { fill: '#8A52E6', stroke: '#6D38C0' };
        },
        strokeWidth: 2,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Category',
          color: '#2d4a1f'
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f'
        },
        min: 0,
        max: 100,
        interval: 5
      }
    ]
  };

  // Chart 6: WBE Goal - Bar Chart
  const wbeGoalOptions = {
    title: {
      text: 'WBE (Women Business Enterprise) Goal',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4a1f'
    },
    data: [
      { category: 'Goal', percentage: 30 },
      { category: 'Commitment', percentage: 28 },
      { category: 'Actual', percentage: 25 }
    ],
    series: [
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'percentage',
        yName: 'Percentage',
        itemStyler: ({ datum }) => {
          const colors = {
            'Goal': { fill: '#3FD9E6', stroke: '#1DC0CD' },
            'Commitment': { fill: '#E6A041', stroke: '#CD892E' },
            'Actual': { fill: '#8A52E6', stroke: '#6D38C0' }
          };
          return colors[datum.category] || { fill: '#3FD9E6', stroke: '#1DC0CD' };
        },
        strokeWidth: 2,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Category',
          color: '#2d4a1f'
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f'
        },
        min: 0,
        max: 100,
        interval: 5
      }
    ]
  };

  // Common chart container style
  const chartContainerStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    padding: '15px',
    minHeight: '350px',
    height: '100%'
  };

  return (
    <div className={`main-wrapper ${mainShifted ? 'shifted' : ''}`}>
      <main>
        <div className="content-container">
          <div className="dashboard-grid">
            {/* Chart 1: Residency Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <AgCharts options={residencyGoalOptions} />
            </div>

            {/* Chart 2: Female Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <AgCharts options={femaleWorkforceOptions} />
            </div>

            {/* Chart 3: Race Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <AgCharts options={raceWorkforceOptions} />
            </div>

            {/* Chart 4: Minority Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <AgCharts options={minorityWorkforceOptions} />
            </div>

            {/* Chart 5: MBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <AgCharts options={mbeGoalOptions} />
            </div>

            {/* Chart 6: WBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <AgCharts options={wbeGoalOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
