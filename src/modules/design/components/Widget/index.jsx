import React from 'react'
import { Row, Col } from 'antd'
import { MdOutlineDraw } from 'react-icons/md'
import { GrCompliance } from 'react-icons/gr'
import { SiTicktick } from 'react-icons/si'
import moment from 'moment'
import './index.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* <div className="row"> */}
      <Row gutter={16}>
        <Col span={8}>
          <div
            className="card orange"
            style={{
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            }}
          >
            <div className="card icon">
              <MdOutlineDraw />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginTop: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderBottom: 'black 1px solid',
                  marginBottom: '5px',
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Drawing - Status</h4>
                </div>
                <div>
                  <h5>{moment().format('MMM-YYYY')}</h5>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                }}
              >
                <div>No. of Planned</div>
                <div>No. of Completed</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <div style={{ marginLeft: '30px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>10</span>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>20</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div
            className="card orange"
            style={{
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            }}
          >
            <div className="card icon">
              <SiTicktick />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginTop: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderBottom: 'black 1px solid',
                  marginBottom: '5px',
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>DAP - Status</h4>
                </div>
                <div>
                  <h5>{moment().format('MMM-YYYY')}</h5>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                }}
              >
                <div>No. of Planned</div>
                <div>No. of Completed</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <div style={{ marginLeft: '30px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>10</span>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>20</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div
            className="card orange"
            style={{
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            }}
          >
            <div className="card icon">
              <GrCompliance />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginTop: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderBottom: 'black 1px solid',
                  marginBottom: '5px',
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Project Manual - Status</h4>
                </div>
                <div>
                  <h5>{moment().format('MMM-YYYY')}</h5>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                }}
              >
                <div>No. of Planned</div>
                <div>No. of Completed</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <div style={{ marginLeft: '30px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>10</span>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>20</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* </div> */}
    </div>
  )
}

export default Dashboard
