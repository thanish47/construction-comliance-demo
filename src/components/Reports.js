import { Outlet, useOutletContext } from 'react-router-dom';

const Reports = () => {
  const { mainShifted } = useOutletContext();

  return (
    <div className={`main-wrapper ${mainShifted ? 'shifted' : ''}`}>
      <main>
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Reports;
