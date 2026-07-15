import React from 'react'
import { Card, Skeleton, Tooltip } from 'antd'
// import moment from 'moment'
import BadgeComponent from '../../common/BadgeComponent'
import DividerComponent from '../../common/DividerComponent'
// import style from './style.module.scss'

const GridDesignComponent = ({
  GridData,
  onClick,
  DetailsLabel,
  title,
  // moduleType,
  isLoading,
}) => {
  // const budgIndntBal = Number(GridData.indentPlan) - Number(GridData.indentActual)
  const handleCardClick = data => {
    if (onClick) {
      onClick(data)
    }
  }

  return (
    <div className="tileview">
      {GridData.length > 0 ? (
        <div>
          <div style={{ marginTop: '7px', fontWeight: 'bold' }}>{`${title}:`}</div>
          <div
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '98vw',
              height: '200px',
              marginTop: '7px',
            }}
          >
            {GridData.map((data, index) => (
              <div
                key={data.id || index}
                // className={`col-xl-${12 / columns.xl} col-lg-${12 / columns.lg} col-md-${12 /
                //   columns.md} col-sm-${12 / columns.sm} col-12`}
                style={{ display: 'inline-block', marginRight: '15px' }}
              >
                <Card
                  style={{ width: '330px', height: '160px', borderRadius: '5px' }}
                  bodyStyle={{ lineHeight: '0.2' }}
                >
                  {isLoading ? (
                    <Skeleton active />
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.customerName}</p> */}
                        <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {data.customerName.length > 20 ? (
                            <span style={{ cursor: 'pointer' }}>
                              {data.customerName.substring(0, 20)}
                              <Tooltip title={data.customerName} placement="rightTop">
                                ...
                              </Tooltip>
                            </span>
                          ) : (
                            data.customerName
                          )}
                        </p>
                        <div style={{ marginTop: '-20px', color: 'black' }}>
                          <style>
                            {`
                             .ant-ribbon-text {
                             color: black !important;
                            }
                          `}
                          </style>
                          <BadgeComponent
                            Status={data.hdrStatusDesc}
                            // Status="New"
                            // TextVal={
                            //   data.hdrStatusDesc === 'Order Hold'
                            //     ? data.hdrStatusDesc
                            //     : data.hdrStatusDesc === 'Order Won'
                            //     ? data.hdrStatusDesc
                            //     : 'In Progress'
                            // }
                            // TextVal="New"
                            TextVal={data.hdrStatusDesc}
                            // BadgeColor={
                            //   data.hdrStatusDesc === 'Order Hold'
                            //     ? '#E9967A'
                            //     : data.hdrStatusDesc === 'Order Won'
                            //       ? '#50C878'
                            //       : '#FFED5F'
                            // }
                            BadgeColor="#FFED5F"
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '-20px' }}>
                        <DividerComponent />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '-12px',
                        }}
                      >
                        <p style={{ fontSize: '16px' }}>Indent C/V/A/PO</p>
                        <p style={{ fontSize: '16px' }}>Task P/C</p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '-1px',
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 'normal',
                            fontSize: '16px',
                          }}
                        >
                          {`${data.checked != null ? data.checked : '0'}/${
                            data.verified != null ? data.verified : '0'
                          }/${data.approved != null ? data.approved : '0'}/${
                            data.indentActual != null ? data.indentActual : '0'
                          }`}
                        </p>
                        <p
                          style={{
                            fontWeight: 'normal',
                            fontSize: '16px',
                          }}
                        >
                          {`${data.taskPlan != null ? data.taskPlan : '0'}/${
                            data.taskActual != null ? data.taskActual : '0'
                          }`}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '2px',
                        }}
                      >
                        <p style={{ fontSize: '16px' }}>PJS V/A</p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '-1px',
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 'normal',
                            fontSize: '16px',
                          }}
                        >
                          {`${data.designVerified != null ? data.designVerified : '0'}/${
                            data.designApproved != null ? data.designApproved : '0'
                          }`}
                        </p>
                      </div>
                      <div style={{ marginTop: '-28px' }}>
                        <DividerComponent />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '-12px',
                        }}
                      >
                        <a
                          role="button"
                          tabIndex="0"
                          style={{
                            color: 'blue',
                            textDecoration: 'no-underline',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleCardClick(data)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleCardClick(data)
                            }
                          }}
                        >
                          {DetailsLabel}
                        </a>
                        <p>{data.projectCode}</p>
                        {/* {`${data.Status}` === `Order Hold` ? (
                          <p style={{ marginLeft: '5px' }} />
                        ) : (
                          <p style={{ marginLeft: '5px' }}>
                            {moduleType !== undefined && moduleType.toLowerCase() === 'design'
                              ? moment(data.dueDate).format('DD-MMM-YYYY')
                              : data.RFQdate}
                          </p>
                        )} */}

                        {/* {moduleType !== undefined && moduleType.toLowerCase() === 'design' ? (
                          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.designCode}</p>
                        ) : (
                          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.stgDesc}</p>
                        )} */}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default GridDesignComponent
