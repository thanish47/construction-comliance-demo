import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AgCharts } from 'ag-charts-react';

const Dashboard = () => {
  const { mainShifted } = useOutletContext();

  // Consistent color palette matching the app theme
  const themeColors = {
    primary: '#8ea94e',      // Main green
    primaryDark: '#6d8239',  // Dark green
    secondary: '#f48020',    // Orange
    tertiary: '#006124',     // Deep green
    accent1: '#7EBEC5',      // Teal
    accent2: '#fee612',      // Gold
    goal: '#8ea94e',
    commitment: '#f48020',
    actual: '#006124'
  };

  // Chart 1: Residency Goal - Grouped Bar Chart with multiple series
  const residencyGoalOptions = {
    title: {
      text: 'Residency Goal Comparison',
      fontSize: 18,
      fontWeight: '600',
      color: '#1b5e20'
    },
    data: [
      { quarter: 'Q1', goal: 50, actual: 45, projected: 48 },
      { quarter: 'Q2', goal: 52, actual: 49, projected: 51 },
      { quarter: 'Q3', goal: 55, actual: 51, projected: 53 },
      { quarter: 'Q4', goal: 58, actual: 54, projected: 56 }
    ],
    series: [
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'goal',
        yName: 'Goal',
        fill: themeColors.goal,
        stroke: themeColors.primaryDark,
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'actual',
        yName: 'Actual',
        fill: themeColors.actual,
        stroke: '#004a1c',
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'projected',
        yName: 'Projected',
        fill: themeColors.accent1,
        stroke: '#5d9ca1',
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: '',
          color: '#2d4a1f'
        },
        label: {
          color: '#2d4a1f',
          fontSize: 13,
          fontWeight: '500'
        },
        gridLine: {
          enabled: false
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f',
          fontSize: 12
        },
        label: {
          color: '#666',
          fontSize: 11
        },
        min: 0,
        max: 70,
        gridLine: {
          style: [{ stroke: 'rgba(0,0,0,0.1)', lineDash: [4, 4] }]
        }
      }
    ],
    padding: {
      top: 5,
      right: 10,
      bottom: 15,
      left: 40
    }
  };

  // Chart 2: Female Workforce - Line Chart
  const femaleWorkforceOptions = {
    title: {
      text: 'Female Workforce',
      fontSize: 18,
      fontWeight: '600',
      color: '#1b5e20'
    },
    data: [
      { month: 'Jan', goal: 45, actual: 42 },
      { month: 'Feb', goal: 45, actual: 42 },
      { month: 'Mar', goal: 46, actual: 43 },
      { month: 'Apr', goal: 46, actual: 43 },
      { month: 'May', goal: 47, actual: 44 },
      { month: 'Jun', goal: 48, actual: 45 }
    ],
    series: [
      {
        type: 'line',
        xKey: 'month',
        yKey: 'goal',
        yName: 'Goal',
        stroke: themeColors.goal,
        strokeWidth: 3,
        marker: {
          enabled: true,
          fill: themeColors.goal,
          stroke: themeColors.primaryDark,
          strokeWidth: 2,
          size: 8
        }
      },
      {
        type: 'line',
        xKey: 'month',
        yKey: 'actual',
        yName: 'Actual',
        stroke: themeColors.actual,
        strokeWidth: 3,
        marker: {
          enabled: true,
          fill: themeColors.actual,
          stroke: '#004a1c',
          strokeWidth: 2,
          size: 8
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: {
          color: '#2d4a1f',
          fontSize: 11,
          fontWeight: '500'
        },
        gridLine: {
          enabled: false
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f',
          fontSize: 12
        },
        label: {
          color: '#666',
          fontSize: 10
        },
        min: 0,
        max: 100,
        gridLine: {
          style: [{ stroke: 'rgba(0,0,0,0.1)', lineDash: [4, 4] }]
        }
      }
    ],
    padding: {
      top: 5,
      right: 10,
      bottom: 20,
      left: 40
    }
  };

  // Chart 3: Race Workforce - Pie Chart
  const raceWorkforceOptions = {
    title: {
      text: 'Race Workforce Distribution',
      fontSize: 18,
      fontWeight: '600',
      color: '#1b5e20'
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
        fills: [themeColors.primary, themeColors.tertiary, themeColors.secondary, themeColors.accent1],
        strokes: [themeColors.primaryDark, '#004a1c', '#c66a1a', '#5d9ca1'],
        strokeWidth: 3,
        calloutLabel: {
          enabled: true,
          fontSize: 12,
          color: '#2d4a1f',
          fontWeight: '500'
        },
        sectorLabel: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 13
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.15)',
          xOffset: 0,
          yOffset: 3,
          blur: 8
        }
      }
    ],
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }
  };

  // Chart 4: Minority Workforce - Area Chart
  const minorityWorkforceOptions = {
    title: {
      text: 'Minority Workforce',
      fontSize: 18,
      fontWeight: '600',
      color: '#1b5e20'
    },
    data: [
      { month: 'Jan', goal: 55, actual: 50 },
      { month: 'Feb', goal: 55, actual: 51 },
      { month: 'Mar', goal: 55, actual: 52 },
      { month: 'Apr', goal: 56, actual: 53 },
      { month: 'May', goal: 56, actual: 54 },
      { month: 'Jun', goal: 56, actual: 54 }
    ],
    series: [
      {
        type: 'area',
        xKey: 'month',
        yKey: 'goal',
        yName: 'Goal',
        fill: themeColors.secondary,
        fillOpacity: 0.3,
        stroke: themeColors.secondary,
        strokeWidth: 3,
        marker: {
          enabled: true,
          fill: themeColors.secondary,
          stroke: '#c66a1a',
          strokeWidth: 2,
          size: 6
        }
      },
      {
        type: 'area',
        xKey: 'month',
        yKey: 'actual',
        yName: 'Actual',
        fill: themeColors.tertiary,
        fillOpacity: 0.3,
        stroke: themeColors.tertiary,
        strokeWidth: 3,
        marker: {
          enabled: true,
          fill: themeColors.tertiary,
          stroke: '#004a1c',
          strokeWidth: 2,
          size: 6
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: {
          color: '#2d4a1f',
          fontSize: 11,
          fontWeight: '500'
        },
        gridLine: {
          enabled: false
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f',
          fontSize: 12
        },
        label: {
          color: '#666',
          fontSize: 10
        },
        min: 0,
        max: 100,
        gridLine: {
          style: [{ stroke: 'rgba(0,0,0,0.1)', lineDash: [4, 4] }]
        }
      }
    ],
    padding: {
      top: 10,
      right: 15,
      bottom: 25,
      left: 45
    }
  };

  // Chart 5: MBE Goal - Grouped Bar Chart
  const mbeGoalOptions = {
    title: {
      text: 'MBE (Minority Business Enterprise) Goal',
      fontSize: 18,
      fontWeight: '600',
      color: '#1b5e20'
    },
    data: [
      { quarter: 'Q1', goal: 35, commitment: 28, actual: 26 },
      { quarter: 'Q2', goal: 35, commitment: 30, actual: 27 },
      { quarter: 'Q3', goal: 36, commitment: 31, actual: 29 },
      { quarter: 'Q4', goal: 36, commitment: 33, actual: 30 }
    ],
    series: [
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'goal',
        yName: 'Goal',
        fill: themeColors.goal,
        stroke: themeColors.primaryDark,
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'commitment',
        yName: 'Commitment',
        fill: themeColors.commitment,
        stroke: '#c66a1a',
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'actual',
        yName: 'Actual',
        fill: themeColors.actual,
        stroke: '#004a1c',
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: '',
          color: '#2d4a1f'
        },
        label: {
          color: '#2d4a1f',
          fontSize: 13,
          fontWeight: '500'
        },
        gridLine: {
          enabled: false
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f',
          fontSize: 12
        },
        label: {
          color: '#666',
          fontSize: 11
        },
        min: 0,
        max: 45,
        gridLine: {
          style: [{ stroke: 'rgba(0,0,0,0.1)', lineDash: [4, 4] }]
        }
      }
    ],
    padding: {
      top: 5,
      right: 10,
      bottom: 15,
      left: 40
    }
  };

  // Chart 6: WBE Goal - Grouped Bar Chart
  const wbeGoalOptions = {
    title: {
      text: 'WBE (Women Business Enterprise) Goal',
      fontSize: 18,
      fontWeight: '600',
      color: '#1b5e20'
    },
    data: [
      { quarter: 'Q1', goal: 30, commitment: 25, actual: 22 },
      { quarter: 'Q2', goal: 30, commitment: 27, actual: 24 },
      { quarter: 'Q3', goal: 31, commitment: 28, actual: 26 },
      { quarter: 'Q4', goal: 31, commitment: 29, actual: 27 }
    ],
    series: [
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'goal',
        yName: 'Goal',
        fill: themeColors.goal,
        stroke: themeColors.primaryDark,
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'commitment',
        yName: 'Commitment',
        fill: themeColors.commitment,
        stroke: '#c66a1a',
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'actual',
        yName: 'Actual',
        fill: themeColors.actual,
        stroke: '#004a1c',
        strokeWidth: 2,
        cornerRadius: 6,
        label: {
          enabled: true,
          formatter: ({ value }) => `${value}%`,
          color: '#ffffff',
          fontWeight: '600',
          fontSize: 11
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: '',
          color: '#2d4a1f'
        },
        label: {
          color: '#2d4a1f',
          fontSize: 13,
          fontWeight: '500'
        },
        gridLine: {
          enabled: false
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Percentage (%)',
          color: '#2d4a1f',
          fontSize: 12
        },
        label: {
          color: '#666',
          fontSize: 11
        },
        min: 0,
        max: 40,
        gridLine: {
          style: [{ stroke: 'rgba(0,0,0,0.1)', lineDash: [4, 4] }]
        }
      }
    ],
    padding: {
      top: 5,
      right: 10,
      bottom: 15,
      left: 40
    }
  };

  // Common chart container style with enhanced visual appeal
  const chartContainerStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(142, 169, 78, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(142, 169, 78, 0.15)',
    padding: '15px',
    height: '450px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default'
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
              <div style={{ width: '100%', height: '420px' }}>
                <AgCharts options={femaleWorkforceOptions} />
              </div>
            </div>

            {/* Chart 3: Race Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={{ width: '100%', height: '420px' }}>
                <AgCharts options={raceWorkforceOptions} />
              </div>
            </div>

            {/* Chart 4: Minority Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={{ width: '100%', height: '420px' }}>
                <AgCharts options={minorityWorkforceOptions} />
              </div>
            </div>

            {/* Chart 5: MBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={{ width: '100%', height: '420px' }}>
                <AgCharts options={mbeGoalOptions} />
              </div>
            </div>

            {/* Chart 6: WBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={{ width: '100%', height: '420px' }}>
                <AgCharts options={wbeGoalOptions} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
