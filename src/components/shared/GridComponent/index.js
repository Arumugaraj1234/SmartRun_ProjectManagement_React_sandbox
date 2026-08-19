/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Card, Skeleton, Tooltip } from 'antd'
import moment from 'moment'
import BadgeComponent from '../../common/BadgeComponent'
import DividerComponent from '../../common/DividerComponent'
import { useMediaQuery } from 'react-responsive'
import style from './style.module.scss'

const GridComponent = ({
  GridData,
  ProjectLabel,
  ValueLabel,
  onClick,
  rupee,
  DetailsLabel,
  moduleType,
  isLoading,
  title,
}) => {
  // const budgIndntBal = Number(GridData.indentPlan) - Number(GridData.indentActual)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [tableWidth, setTableWidth] = useState('265px')

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const handleCardClick = data => {
    if (onClick) {
      onClick(data)
    }
  }
  const convertToLakhs = value => {
    return (value / 100000).toFixed(2)
  }
  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  return (
    <div className="tileview">
      {GridData?.length > 0 ? (
        <div>
          <div style={{ marginTop: '7px', fontWeight: 'bold' }}>{`${title}:`}</div>
          <div
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: isMobile ? tableWidth : '98vw',
              height: '200px',
              marginTop: '7px',
            }}
          >
            {GridData?.map((data, index) => (
              <div
                key={data.id || index}
                // className={`col-xl-${12 / columns.xl} col-lg-${12 / columns.lg} col-md-${12 /
                //   columns.md} col-sm-${12 / columns.sm} col-12`}
                style={{ display: 'inline-block', marginRight: '15px', textWrap: 'balance' }}
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
                        <div
                          className={`project-badge-${(title || '').replace(
                            /[^a-zA-Z0-9]/g,
                            '',
                          )}-${data.id || index}`}
                          style={{ marginTop: '-20px', color: 'black' }}
                        >
                          <style>
                            {moduleType !== undefined && moduleType.toLowerCase() === 'project'
                              ? `
                             .project-badge-${(title || '').replace(
                               /[^a-zA-Z0-9]/g,
                               '',
                             )}-${data.id || index} .ant-ribbon-text {
                             color: ${data.costFlowType === 'NEW' ? '#ffffff' : 'black'} !important;
                            }
                          `
                              : `
                             .project-badge-${(title || '').replace(
                               /[^a-zA-Z0-9]/g,
                               '',
                             )}-${data.id || index} .ant-ribbon-text {
                             color: black !important;
                            }
                          `}
                          </style>
                          <BadgeComponent
                            Status={data.hdrStatusDesc}
                            // TextVal={
                            //   data.hdrStatusDesc === 'Order Hold'
                            //     ? data.hdrStatusDesc
                            //     : data.hdrStatusDesc === 'Order Won'
                            //     ? data.hdrStatusDesc
                            //     : 'In Progress'
                            // }
                            TextVal={data.hdrStatusDesc}
                            // BadgeColor={
                            //   data.hdrStatusDesc === 'Order Hold'
                            //     ? '#E9967A'
                            //     : data.hdrStatusDesc === 'Order Won'
                            //       ? '#50C878'
                            //       : '#FFED5F'
                            // }
                            BadgeColor={
                              moduleType !== undefined &&
                              moduleType.toLowerCase() === 'project' &&
                              data.costFlowType === 'NEW'
                                ? '#1D3557'
                                : '#FFED5F'
                            }
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
                        <p>{ProjectLabel}</p>
                        <p>{ValueLabel}</p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '17px',
                          marginTop: '5px',
                          height: '25px',
                        }}
                      >
                        <p
                          style={{
                            width: '60%',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            lineHeight: '1.0',
                          }}
                        >
                          {moduleType !== undefined && moduleType.toLowerCase() === 'design' ? (
                            <p>{`${data.checked != null ? data.checked : '0'}/${
                              data.verified != null ? data.verified : '0'
                            }/${data.approved != null ? data.approved : '0'}/${
                              data.indentActual != null ? data.indentActual : '0'
                            }`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'project' ? (
                            <p>{`${currencyFormat(
                              data.costFlowType === 'NEW' ? data.allocatedValue : data.indentPlan,
                            )}`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'sales' ? (
                            <p>{data.projectName}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'scm' ? (
                            <p>{data.intentCount}</p>
                          ) : moduleType !== undefined &&
                            moduleType.toLowerCase() === 'assembly' ? (
                            <p>{`${data.indentCount || 0}/${data.indentIsCompletedCount || 0}`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'quality' ? (
                            <p>{data.qtyinspectionTotal}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'finance' ? (
                            <p>{data.projectName}</p>
                          ) : (
                            ''
                          )}
                          {/* moduleType !== undefined && moduleType.toLowerCase() === 'design' ? (
                            <p>{`${data.indentActual}/${data.indentPlan}`}</p>
                          ) : (
                            <p>{data.projectName}</p>
                          ) */}
                        </p>
                        <p
                          style={{
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            lineHeight: '1.0',
                            textAlign: 'right',
                          }}
                        >
                          {moduleType !== undefined && moduleType.toLowerCase() === 'design' ? (
                            <p>{`${data.taskPlan != null ? data.taskPlan : '0'}/${
                              data.taskActual != null ? data.taskActual : '0'
                            }`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'project' ? (
                            <p>{`${currencyFormat(
                              data.costFlowType === 'NEW' ? data.actualSpent : data.indentActual,
                            )}`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'sales' ? (
                            <p>{`${convertToLakhs(data.finalCost)}${rupee}`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'scm' ? (
                            <p>{data.poCount}</p>
                          ) : moduleType !== undefined &&
                            moduleType.toLowerCase() === 'assembly' ? (
                            <p>{`${data.materialRequestHdrCount ||
                              0}/${data.materialRequestIsCompletedCount || 0}`}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'quality' ? (
                            <p>{data.qtyinspectionCompleted}</p>
                          ) : moduleType !== undefined && moduleType.toLowerCase() === 'finance' ? (
                            <p>
                              {data.initiatedDate
                                ? moment(data.initiatedDate).format('DD-MMM-YYYY')
                                : ''}
                            </p>
                          ) : (
                            ''
                          )}
                          {/* {`${convertToLakhs(data.tentativePoValue)}${rupee}`} */}
                          {/* moduleType !== undefined && moduleType.toLowerCase() === 'design' ? (
                            <p>{`${data.taskActual}/${data.taskPlan}`}</p>
                          ) : (
                            <p>{`${convertToLakhs(data.tentativePoValue)}${rupee}`}</p>
                          ) */}
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

                        {moduleType !== undefined && moduleType.toLowerCase() === 'project' ? (
                          <p style={{ fontWeight: 'bold' }}>{data.projCode}</p>
                        ) : (
                          <p style={{ fontWeight: 'bold' }}>{data.projectCode || data.enquiryCode}</p>
                        )}

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

export default GridComponent
