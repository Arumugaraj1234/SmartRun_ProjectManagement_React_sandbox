/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react'
import './index.css'
import { Row, Col } from 'antd'
import { AiFillDollarCircle } from 'react-icons/ai'
import { FaInfoCircle } from 'react-icons/fa'

const Dashboard = ({ widgetData, handleClick = () => {}, val }) => {
  return (
    <div className="dashboard">
      <Row gutter={[24, 24]}>
        <Col lg={6} md={8} sm={24} xs={24}>
          <div className="card cutom-card orange">
            <div className="card icon1">
              <AiFillDollarCircle />
            </div>
            <span
              onClick={handleClick}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
              tabIndex={0}
              style={{ textAlign: 'right', fontSize: '30px' }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClick()
                }
              }}
            >
              <FaInfoCircle />
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* <div className="label">{`Sales Vs Target ${val}`}</div>
              <div className="value">
                {widgetData && widgetData.length > 0
                  ? `${((widgetData[0]?.balanceValue / widgetData[0]?.saleValue) % 100).toFixed(
                      2,
                    ) || '0'}%`
                  : ''}
              </div> */}
              <div>
                <p className="mb-1">Sales Contribution{val}</p>
                <div className="value" style={{ fontSize: '17px' }}>
                  {widgetData && widgetData.length > 0
                    ? `${parseFloat(widgetData[0]?.saleContribution / 1e7)
                        .toFixed(2)
                        .toLocaleString('en-IN')}C`
                    : ''}
                </div>
              </div>
              <div>
                <p className="mb-1">Execution Savings{val}</p>
                <div className="value" style={{ fontSize: '17px' }}>
                  {widgetData && widgetData.length > 0
                    ? `${parseFloat(widgetData[0]?.balanceValue / 1e7)
                        .toFixed(2)
                        .toLocaleString('en-IN')}C`
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} md={8} sm={24} xs={24}>
          <div className="card cutom-card orange">
            <div className="card icon2">
              <AiFillDollarCircle />
            </div>
            <p
              onClick={handleClick}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
              tabIndex={0}
              style={{ textAlign: 'right', fontSize: '30px' }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClick()
                }
              }}
            >
              <FaInfoCircle />
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="label">{`Overall Budget ${val}`}</div>
              <div className="value">
                {widgetData && widgetData.length > 0
                  ? `${parseFloat(widgetData[0]?.pmBudgetValue / 1e7)
                      .toFixed(2)
                      .toLocaleString('en-IN')}C`
                  : ''}
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} md={8} sm={24} xs={24}>
          <div className="card cutom-card orange">
            <div className="card icon3">
              <AiFillDollarCircle />
            </div>
            <p
              onClick={handleClick}
              role="button"
              tabIndex={0}
              style={{ textAlign: 'right', fontSize: '30px' }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClick()
                }
              }}
            >
              <FaInfoCircle />
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="label">{`Overall Target ${val}`}</div>
              <div className="value">
                {widgetData && widgetData.length > 0
                  ? `${parseFloat(widgetData[0]?.targetValue / 1e7)
                      .toFixed(2)
                      .toLocaleString('en-IN')}C`
                  : ''}
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} md={8} sm={24} xs={24}>
          <div className="card cutom-card orange">
            <div className="card icon4">
              <AiFillDollarCircle />
            </div>
            <p
              onClick={handleClick}
              role="button"
              tabIndex={0}
              style={{ textAlign: 'right', fontSize: '30px' }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClick()
                }
              }}
            >
              <FaInfoCircle />
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="label">{`Overall Actuals ${val}`}</div>
              <div className="value">
                {widgetData && widgetData.length > 0
                  ? `${parseFloat(
                      parseInt(widgetData[0]?.materialTransferValue, 10) +
                        parseInt(widgetData[0]?.scmPoValue, 10) / 1e7,
                    )
                      .toFixed(2)
                      .toLocaleString('en-IN')}C`
                  : ''}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
