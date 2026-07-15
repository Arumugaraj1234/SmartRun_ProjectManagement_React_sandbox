import React from 'react'
import './index.css'
import { AiTwotoneSafetyCertificate } from 'react-icons/ai'
import { TbSum } from 'react-icons/tb'
import { SiTicktick } from 'react-icons/si'
// import { GrUpdate } from 'react-icons/gr'
// import { ImCross } from 'react-icons/im'
import { FaSearch } from 'react-icons/fa'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="row">
        <div className="card orange">
          <div className="card icon">
            <TbSum />
          </div>
          <div style={{ paddingLeft: '100px' }}>
            <div className="label">No. of PO</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <FaSearch />
          </div>
          <div style={{ paddingLeft: '100px' }}>
            <div className="label">Indent to PO</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <SiTicktick />
          </div>
          <div style={{ paddingLeft: '100px' }}>
            <div className="label">Pending Indent</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <AiTwotoneSafetyCertificate />
          </div>
          <div style={{ paddingLeft: '100px' }}>
            <div className="label">Items Delayed</div>
            <div className="value">49,650</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
