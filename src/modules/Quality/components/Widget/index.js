import React from 'react'
import './index.css'
import { AiTwotoneSafetyCertificate } from 'react-icons/ai'
import { TbSum } from 'react-icons/tb'
import { SiTicktick } from 'react-icons/si'
import { GrUpdate } from 'react-icons/gr'
import { ImCross } from 'react-icons/im'
import { FaSearch, FaInfoCircle } from 'react-icons/fa'

const Dashboard = ({ widgetData, projCount, handleClick = () => {} }) => {
  return (
    <div className="dashboard">
      <div className="row widget">
        <div className="card orange col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <div className="card icon1">
            <TbSum />
          </div>
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <div className="label">Total No of Project</div>
            <div
              className="value"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-30px' }}
            >
              <p>
                {projCount !== 'null' && projCount
                  ? parseFloat(projCount).toLocaleString('en-IN')
                  : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="card orange col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <div className="card icon2">
            <FaSearch />
          </div>
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <div className="label">Total Inspection Call</div>
            <div
              className="value"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-30px' }}
            >
              <p>
                {widgetData && widgetData.length > 0 && widgetData[0].inspCall !== null
                  ? parseFloat(widgetData[0].inspCall).toLocaleString('en-IN')
                  : ''}
              </p>
              <p
                onClick={() => handleClick('INSPECTION_QTY', 'Total Inspection Call')}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick()
                  }
                }}
              >
                <FaInfoCircle />
              </p>
            </div>
          </div>
        </div>
        <div className="card orange col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <div className="card icon3">
            <SiTicktick />
          </div>
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <div className="label">Inspection Ok</div>
            <div
              className="value"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-30px' }}
            >
              <p>
                {widgetData && widgetData.length > 0 && widgetData[0].inspOk !== null
                  ? parseFloat(widgetData[0].inspOk).toLocaleString('en-IN')
                  : ''}
              </p>
              <p
                onClick={() => handleClick('inspOk', 'Inspection Ok')}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick()
                  }
                }}
              >
                <FaInfoCircle />
              </p>
            </div>
          </div>
        </div>
        <div className="card orange col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <div className="card icon4">
            <AiTwotoneSafetyCertificate />
          </div>
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <div className="label">CA</div>
            <div
              className="value"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-30px' }}
            >
              <p>
                {widgetData && widgetData.length > 0 && widgetData[0].ca !== null
                  ? parseFloat(widgetData[0].ca).toLocaleString('en-IN')
                  : ''}
              </p>
              <p
                onClick={() => handleClick('CA', 'CA')}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick()
                  }
                }}
              >
                <FaInfoCircle />
              </p>
            </div>
          </div>
        </div>
        <div className="card orange col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <div className="card icon5">
            <ImCross />
          </div>
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <div className="label">Reject</div>
            <div
              className="value"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-30px' }}
            >
              <p>
                {widgetData && widgetData.length > 0 && widgetData[0].rejQty !== null
                  ? parseFloat(widgetData[0].rejQty).toLocaleString('en-IN')
                  : ''}
              </p>
              <p
                onClick={() => handleClick('rej', 'Reject')}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick()
                  }
                }}
              >
                <FaInfoCircle />
              </p>
            </div>
          </div>
        </div>
        <div className="card orange col-lg-2 col-md-4 col-sm-12 col-xs-12">
          <div className="card icon6">
            <GrUpdate />
          </div>
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <div className="label">Rework</div>
            <div
              className="value"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-30px' }}
            >
              <p>
                {widgetData && widgetData.length > 0 && widgetData[0].reworkQty !== null
                  ? parseFloat(widgetData[0].reworkQty).toLocaleString('en-IN')
                  : ''}
              </p>
              <p
                onClick={() => handleClick('reWork', 'Rework')}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick()
                  }
                }}
              >
                <FaInfoCircle />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
