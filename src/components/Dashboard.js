import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
    blue: '#0f62fe',
    purple: '#8a3ffc',
    red: '#fa4d56',
    teal: '#007d79',
    goal: '#8ea94e',
    commitment: '#f48020',
    actual: '#006124',
    cyan: '#00539a'
  };

  // Chart 1: Residency Goal - Bar Chart
  const residencyGoalData = [
    { name: 'Goal', value: 50, type: 'Goal' },
    { name: 'Actual', value: 45, type: 'Actual' }
  ];

  // Chart 2: Female Workforce - Pie Chart
  const femaleWorkforceData = [
    { name: 'Goal', value: 45 },
    { name: 'Actual', value: 42 }
  ];

  const femaleWorkforceColors = [themeColors.red, themeColors.teal];

  // Chart 3: Race Workforce - Pie Chart
  const raceWorkforceData = [
    { name: 'African American', value: 30 },
    { name: 'Caucasian', value: 45 },
    { name: 'Hispanic', value: 20 },
    { name: 'Native American', value: 5 }
  ];

  const raceColors = [themeColors.primary, themeColors.tertiary, themeColors.secondary, themeColors.accent1];

  // Chart 4: Minority Workforce - Pie Chart
  const minorityWorkforceData = [
    { name: 'Goal', value: 55 },
    { name: 'Actual', value: 50 }
  ];

  const minorityWorkforceColors = [themeColors.cyan, themeColors.red];

  // Chart 5: MBE Goal - Bar Chart
  const mbeGoalData = [
    { name: 'Goal', value: 35, type: 'Goal' },
    { name: 'Actual', value: 26, type: 'Actual' },
  ];

  // Chart 6: WBE Goal - Bar Chart
  const wbeGoalData = [
    { name: 'Goal', value: 30, type: 'Goal' },
    { name: 'Actual', value: 22, type: 'Actual' }
  ];

  // Common chart container style - Enhanced Glassmorphism
  const chartContainerStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
    padding: '20px',
    height: '450px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden'
  };

  const chartTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: '15px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
    letterSpacing: '0.5px'
  };

  // Custom tooltip with glassmorphism
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#1b5e20', fontSize: '14px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '13px', fontWeight: '600' }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`main-wrapper ${mainShifted ? 'shifted' : ''}`}>
      <main>
        <div className="content-container">
          <div className="dashboard-grid">
            {/* Chart 1: Residency Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>Residency Goal Comparison</div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={residencyGoalData} margin={{ top: 5, right: 10, bottom: 15, left: 0 }} barSize={80}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.blue} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={themeColors.blue} stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.purple} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={themeColors.purple} stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" strokeWidth={1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#1b5e20', fontSize: 11, fontWeight: 600 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <YAxis
                    domain={[0, 70]}
                    tick={{ fill: '#1b5e20', fontSize: 11, fontWeight: 500 }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#1b5e20', fontSize: 12, fontWeight: 600 } }}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {residencyGoalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'Goal' ? 'url(#blueGradient)' : 'url(#purpleGradient)'}
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Female Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>Female Workforce</div>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={femaleWorkforceData}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: 'rgba(27, 94, 32, 0.5)', strokeWidth: 2 }}
                    label={({ name, value }) => `${name}: ${value}%`}
                    innerRadius={70}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {femaleWorkforceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={femaleWorkforceColors[index % femaleWorkforceColors.length]}
                        stroke="rgba(255, 255, 255, 0.6)"
                        strokeWidth={3}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3: Race Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>Race Workforce Distribution</div>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={raceWorkforceData}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: 'rgba(27, 94, 32, 0.5)', strokeWidth: 2 }}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {raceWorkforceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={raceColors[index % raceColors.length]}
                        stroke="rgba(255, 255, 255, 0.6)"
                        strokeWidth={3}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 4: Minority Workforce */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>Minority Workforce</div>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={minorityWorkforceData}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: 'rgba(27, 94, 32, 0.5)', strokeWidth: 2 }}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {minorityWorkforceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={minorityWorkforceColors[index % minorityWorkforceColors.length]}
                        stroke="rgba(255, 255, 255, 0.6)"
                        strokeWidth={3}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 5: MBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>MBE (Minority Business Enterprise) Goal</div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={mbeGoalData} margin={{ top: 5, right: 10, bottom: 15, left: 0 }} barSize={80}>
                  <defs>
                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.accent1} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={themeColors.accent1} stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.red} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={themeColors.red} stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" strokeWidth={1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#1b5e20', fontSize: 11, fontWeight: 600 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <YAxis
                    domain={[0, 45]}
                    tick={{ fill: '#1b5e20', fontSize: 11, fontWeight: 500 }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#1b5e20', fontSize: 12, fontWeight: 600 } }}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {mbeGoalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'Goal' ? 'url(#tealGradient)' : 'url(#redGradient)'}
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 6: WBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>WBE (Women Business Enterprise) Goal</div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={wbeGoalData} margin={{ top: 5, right: 10, bottom: 15, left: 0 }} barSize={80}>
                  <defs>
                    <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.goal} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={themeColors.goal} stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.actual} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={themeColors.actual} stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" strokeWidth={1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#1b5e20', fontSize: 11, fontWeight: 600 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <YAxis
                    domain={[0, 40]}
                    tick={{ fill: '#1b5e20', fontSize: 11, fontWeight: 500 }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#1b5e20', fontSize: 12, fontWeight: 600 } }}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {wbeGoalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'Goal' ? 'url(#goalGradient)' : 'url(#actualGradient)'}
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
