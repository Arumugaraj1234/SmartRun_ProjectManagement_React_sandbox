import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import './style.scss';

const DashboardFilter = () => {
  const [filterCard, setFilterCard] = useState(false);

  const openFiltercard = () => {
    setFilterCard(!filterCard);
  };

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-filter"
        viewBox="0 0 16 16"
        style={{ cursor: 'pointer' }}
        onClick={openFiltercard}
      >
        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
      </svg>
      {filterCard && (
        <div className="dashboard_filter">
          <div style={{ padding: '10px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h5>Dashboard Filter
                <CloseOutlined
                  style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer', background: 'black', padding: '3px', borderRadius: '3px' }}
                  onClick={openFiltercard}
                />
              </h5>
            </div>
            <div className="row" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p>From Date:</p>
                <DatePicker />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p>To Date:</p>
                <DatePicker />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button type="primary">Submit</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilter;
