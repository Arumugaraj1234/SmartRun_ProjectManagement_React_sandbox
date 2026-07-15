import React from 'react'
import { Card, Skeleton, Tooltip } from 'antd'
// import moment from 'moment'
import BadgeComponent from '../../common/BadgeComponent'
import DividerComponent from '../../common/DividerComponent'
// import style from './style.module.scss'

const GridVIIComponent = ({
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
                          marginTop: '-10px',
                        }}
                      >
                        <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          Indent - <span style={{ fontWeight: 'normal' }}>{data.intentCount}</span>
                        </p>
                        <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          PO - <span style={{ fontWeight: 'normal' }}>{data.poCount}</span>
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '10px',
                        }}
                      >
                        <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          MI&nbsp;&nbsp;&nbsp;&emsp; -{' '}
                          <span style={{ fontWeight: 'normal' }}>{data.inwardCount}</span>
                        </p>
                        <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          GRN - <span style={{ fontWeight: 'normal' }}>{data.grnCount}</span>
                        </p>
                      </div>

                      <div style={{ marginTop: '-5px' }}>
                        <DividerComponent />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '-10px',
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

export default GridVIIComponent
