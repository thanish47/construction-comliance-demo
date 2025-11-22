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

  // Common chart container style
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

  const chartTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: '10px',
    textAlign: 'center'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          border: '1px solid rgba(142, 169, 78, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#1b5e20' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color, fontSize: '13px' }}>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#2d4a1f', fontSize: 10, fontWeight: 500 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={[0, 70]}
                    tick={{ fill: '#666', fontSize: 11 }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#2d4a1f', fontSize: 12 } }}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {residencyGoalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'Goal' ? themeColors.blue : themeColors.purple} />
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
                  <Pie
                    data={femaleWorkforceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}%`}
                    innerRadius={70}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {femaleWorkforceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={femaleWorkforceColors[index % femaleWorkforceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
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
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {raceWorkforceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={raceColors[index % raceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
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
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {minorityWorkforceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={minorityWorkforceColors[index % minorityWorkforceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 5: MBE Goal */}
            <div className="chart-container" style={chartContainerStyle}>
              <div style={chartTitleStyle}>MBE (Minority Business Enterprise) Goal</div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={mbeGoalData} margin={{ top: 5, right: 10, bottom: 15, left: 0 }} barSize={80}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#2d4a1f', fontSize: 10, fontWeight: 500 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={[0, 45]}
                    tick={{ fill: '#666', fontSize: 11 }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#2d4a1f', fontSize: 12 } }}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {mbeGoalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'Goal' ? themeColors.accent1 : themeColors.red} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#2d4a1f', fontSize: 10, fontWeight: 500 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={[0, 40]}
                    tick={{ fill: '#666', fontSize: 11 }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#2d4a1f', fontSize: 12 } }}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(142, 169, 78, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {wbeGoalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'Goal' ? themeColors.goal : themeColors.actual} />
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
