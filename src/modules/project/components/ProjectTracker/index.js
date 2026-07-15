import React, { useState, useEffect } from 'react'
import store from 'store'
import moment from 'moment'
import { Table } from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import Buttons from 'components/shared/ButtonComponent'
import ProjectCostAnalysis from '../CostAnalysis'
import Styles from './style.scss'

const ProjectTracker = () => {
  const Tab = store.get('Tab')
  const [updateDsnHdr, setUpdateDsgnHdr] = useState(null)
  const [updateAssy, setUpdateAssyMst] = useState(null)
  const projectID = store.get('ProjectID')
  const { mstId, processCode } = Tab
  const pmHdrid = store.get('ProjectPMHdrId')
  const tenantId = store.get('tenantId')
  const tenantID = store.get('tenantId')
  const [data, setData] = useState([])

  useEffect(() => {
    getTimeline()
    getUpdateDesign('0')
    getUpdateAssyMst('0')
  }, [])

  const [expandedRecordKey, setExpandedRecordKey] = useState(null)

  const handleExpand = recordKey => {
    setExpandedRecordKey(recordKey === expandedRecordKey ? null : recordKey)
  }

  const getTimeline = async () => {
    try {
      const reqobj = {
        projectID,
        tenantID: tenantId,
      }
      const response = await indentFileUpload({
        requestPath: 'getTimeTrackerByProjectId',
        requestData: reqobj,
      })
      if (response) {
        if (response?.responseData && response?.responseData.length > 0) {
          const responseDataWithKeys = response?.responseData.map((record, recordIndex) => ({
            ...record,
            key: recordIndex, // Adding key to each record
            taskEntryDtlEntity:
              record.taskEntryDtlEntity !== null &&
              record.taskEntryDtlEntity.map((task, taskIndex) => ({
                ...task,
                key: taskIndex, // Adding key to each task within the record
              })),
          }))
          setData(responseDataWithKeys)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getUpdateDesign = async val => {
    //
    try {
      const response = await indentFileUpload({
        requestPath: 'updateDesignHdr',
        requestData: {
          pmHdrId: pmHdrid,
          tenantId: tenantID,
          isStatus: val,
          pmId: processCode,
          mstId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          setUpdateDsgnHdr(response.responseDataMessage)
        } else {
          setUpdateDsgnHdr(null)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getUpdateAssyMst = async val => {
    try {
      const response = await indentFileUpload({
        requestPath: 'updateAssyMstResp',
        requestData: {
          pmHdrId: pmHdrid,
          tenantId: tenantID,
          isStatus: val,
          pmId: processCode,
          mstId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          setUpdateAssyMst(response.responseDataMessage)
        } else {
          setUpdateAssyMst(null)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const Column = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Milestone Name',
      dataIndex: 'milestoneName',
      key: 'milestoneName',
      width: '10%',
    },
    {
      title: 'Department',
      dataIndex: 'departName',
      key: 'departName',
      width: '10%',
    },
    {
      title: 'Responsible User',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Planned Start Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      render: (text, record) =>
        record.plannedStartDate !== ''
          ? moment(record.plannedStartDate).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Planned End Date',
      dataIndex: 'plannedEndDate',
      key: 'plannedEndDate',
      render: (text, record) =>
        record.plannedEndDate !== '' ? moment(record.plannedEndDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Act. Start Date',
      dataIndex: 'actualStartDate',
      key: 'actualStartDate',
      render: (text, record) =>
        record.actualStartDate !== '' ? moment(record.actualStartDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Act. End Date',
      dataIndex: 'actualEndDate',
      key: 'actualEndDate',
      render: (text, record) =>
        record.actualEndDate !== '' ? moment(record.actualEndDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'approvalStatusDesc',
      key: 'approvalStatusDesc',
      render: (text, record) => {
        let status = 'Yet to Start'

        if (record.taskEntryDtlEntity && record.taskEntryDtlEntity.length > 0) {
          let allCompleted = true
          record.taskEntryDtlEntity.forEach(task => {
            if (parseInt(task.completePtg, 10) > 0 && parseInt(task.completePtg, 10) < 100) {
              status = 'In Progress'
              allCompleted = false
            } else if (parseInt(task.completePtg, 10) < 100) {
              allCompleted = false
            }
          })

          if (allCompleted) {
            status = 'Completed'
          }
        }

        return status
      },
    },
    {
      title: 'Compl. %',
      dataIndex: 'completionPercentage',
      key: 'completionPercentage',
      align: 'right',
      width: '7%',
      render: (text, record) => {
        let completionPercentage = 0

        if (record.taskEntryDtlEntity && record.taskEntryDtlEntity.length > 0) {
          let totalCompletion = 0
          const totalTasks = record.taskEntryDtlEntity.length

          record.taskEntryDtlEntity.forEach(task => {
            totalCompletion += parseInt(task.completePtg, 10)
          })

          completionPercentage = totalCompletion / totalTasks
        }
        return `${completionPercentage.toFixed(2)}`
      },
    },

    {
      title: 'Delay Days',
      dataIndex: 'departName',
      key: 'departName',
      className: 'right-align-cell',
      render: (text, record) => {
        const diff =
          record.actualEndDate !== ''
            ? moment(record.actualEndDate).diff(moment(record.plannedEndDate), 'days')
            : moment().diff(moment(record.plannedEndDate), 'days')
        return diff <= 0 ? 'NA' : diff
      },
    },
  ]
  const innerTable = [
    // {
    //   title: 'S.No',
    //   dataIndex: 'sno',
    //   key: 'sno',
    //   render: (text, record, index) => index + 1,
    // },
    {
      title: 'Activity',
      dataIndex: 'activityName',
      key: 'activityName',
      width: '20%',
    },
    {
      title: 'Category',
      dataIndex: 'tcDesc',
      key: 'tcDesc',
    },
    {
      title: 'Planned Start Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      render: (text, record) =>
        record.plannedStartDate ? moment(record.plannedStartDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text, record) =>
        record.dueDate ? moment(record.dueDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Act. Start Date',
      dataIndex: 'actualStartDate',
      key: 'actualStartDate',
      render: (text, record) =>
        record.actualStartDate ? moment(record.actualStartDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Act. End Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: (text, record) =>
        record.completedDate ? moment(record.completedDate).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Delay Days',
      dataIndex: 'departName',
      key: 'departName',
      render: (text, record) => {
        const diff =
          record.dueDate !== ''
            ? moment(record.dueDate).diff(moment(record.plannedCompletedDate), 'days')
            : moment().diff(moment(record.plannedCompletedDate), 'days')
        return diff <= 0 ? 'NA' : diff
      },
    },
    {
      title: 'Status',
      dataIndex: 'approvalStatusDesc',
      key: 'approvalStatusDesc',
    },
    {
      title: 'Compl. %',
      dataIndex: 'completePtg',
      key: 'completePtg',
      align: 'right',
      render: (text, record) =>
        record.completePtg !== null ? parseFloat(record.completePtg).toLocaleString('en-IN') : 0,
    },
  ]

  const exportToCSV = () => {
    const csvRows = []

    // Define the mapping from original column headers to data keys for outer table
    const outerColumnMappings = {
      'Milestone Name': 'milestoneName',
      Department: 'departName',
      'Responsible User': 'employeeName',
      'Planned Start Date': 'plannedStartDate',
      'Planned End Date': 'plannedEndDate',
      'Act. Start Date': 'actualStartDate',
      'Act. End Date': 'actualEndDate',
      Status: 'status',
      'Compl. %': 'completionPercentage',
      'Delay Days': 'delayDays',
    }

    // Define the mapping from original column headers to data keys for inner table
    const innerColumnMappings = {
      Activity: 'activityName',
      Category: 'tcDesc',
      'Planned Start Date': 'plannedStartDate',
      'Due Date': 'dueDate',
      'Act. Start Date': 'actualStartDate',
      'Act. End Date': 'completedDate',
      'Delay Days': 'delayDays',
      Status: 'approvalStatusDesc',
      'Compl. %': 'completionPercentage',
    }

    // Add headers for the main table (outer table)
    const outerTableHeaders = Object.keys(outerColumnMappings)
    const outerHeaderRow = outerTableHeaders.map(header => {
      // Simulate background color by adding a pattern to the cell content
      return header
    })
    csvRows.push(outerHeaderRow.join(','))

    // Add a blank line
    csvRows.push('')

    // Iterate over each record in the data array
    if (data && data.length > 0) {
      data.forEach(outerRecord => {
        // Map data to CSV row for the outer record
        const outerCsvRowData = outerTableHeaders.map(header => {
          if (Object.prototype.hasOwnProperty.call(outerColumnMappings, header)) {
            if (header === 'Delay Days') {
              const diff =
                outerRecord.actualEndDate !== ''
                  ? moment(outerRecord.actualEndDate).diff(
                      moment(outerRecord.plannedEndDate),
                      'days',
                    )
                  : moment().diff(moment(outerRecord.plannedEndDate), 'days')
              return diff <= 0 ? 'NA' : diff
            }
            if (header === 'Status') {
              let status = 'Yet to Start'

              if (outerRecord.taskEntryDtlEntity && outerRecord.taskEntryDtlEntity.length > 0) {
                let allCompleted = true
                outerRecord.taskEntryDtlEntity.forEach(task => {
                  if (parseInt(task.completePtg, 10) > 0 && parseInt(task.completePtg, 10) < 100) {
                    status = 'In Progress'
                    allCompleted = false
                  } else if (parseInt(task.completePtg, 10) < 100) {
                    allCompleted = false
                  }
                })

                if (allCompleted) {
                  status = 'Completed'
                }
              }

              return status
            }
            if (header === 'Compl. %') {
              let completionPercentage = 0

              if (outerRecord.taskEntryDtlEntity && outerRecord.taskEntryDtlEntity.length > 0) {
                let totalCompletion = 0
                const totalTasks = outerRecord.taskEntryDtlEntity.length

                outerRecord.taskEntryDtlEntity.forEach(task => {
                  totalCompletion += parseInt(task.completePtg, 10)
                })

                completionPercentage = totalCompletion / totalTasks
              }
              return `${completionPercentage.toFixed(2)}`
            }
            if (header === 'Planned Start Date') {
              return outerRecord.plannedStartDate !== ''
                ? moment(outerRecord.plannedStartDate).format('DD-MMM-YYYY')
                : '-'
            }
            if (header === 'Planned End Date') {
              return outerRecord.plannedEndDate !== ''
                ? moment(outerRecord.plannedEndDate).format('DD-MMM-YYYY')
                : ''
            }
            if (header === 'Act. Start Date') {
              return outerRecord.actualStartDate !== ''
                ? moment(outerRecord.actualStartDate).format('DD-MMM-YYYY')
                : ''
            }
            if (header === 'Act. End Date') {
              return outerRecord.actualEndDate !== ''
                ? moment(outerRecord.actualEndDate).format('DD-MMM-YYYY')
                : ''
            }

            return outerRecord[outerColumnMappings[header]]?.toString().replace(/,/g, '')
          }
          return ''
        })
        csvRows.push(outerCsvRowData.join(','))

        // Add a blank line
        csvRows.push('')

        // Add headers for the inner table
        const innerTableHeaders = Object.keys(innerColumnMappings)
        const innerHeaderRow = innerTableHeaders.map(header => {
          // Simulate background color by adding a pattern to the cell content
          return header
        })
        csvRows.push(innerHeaderRow.join(','))

        // Iterate over each inner record in the taskEntryDtlEntity
        if (outerRecord.taskEntryDtlEntity && outerRecord.taskEntryDtlEntity.length > 0) {
          outerRecord.taskEntryDtlEntity.forEach(innerRecord => {
            // Push inner record data into csvRows
            const innerCsvRowData = innerTableHeaders.map(header => {
              if (Object.prototype.hasOwnProperty.call(innerColumnMappings, header)) {
                if (header === 'Delay Days') {
                  // Calculate delay days for the inner record
                  const diff =
                    innerRecord.dueDate !== ''
                      ? moment(innerRecord.dueDate).diff(
                          moment(innerRecord.plannedCompletedDate),
                          'days',
                        )
                      : moment().diff(moment(innerRecord.plannedCompletedDate), 'days')
                  return diff <= 0 ? 'NA' : diff
                }
                if (header === 'Compl. %') {
                  return innerRecord.completePtg !== null
                    ? parseFloat(innerRecord.completePtg).toLocaleString('en-IN')
                    : 0
                }
                if (header === 'Planned Start Date') {
                  return innerRecord.plannedStartDate !== ''
                    ? moment(innerRecord.plannedStartDate).format('DD-MMM-YYYY')
                    : '-'
                }
                if (header === 'Due Date') {
                  return innerRecord.dueDate !== ''
                    ? moment(innerRecord.dueDate).format('DD-MMM-YYYY')
                    : ''
                }
                if (header === 'Act. Start Date') {
                  return innerRecord.actualStartDate !== ''
                    ? moment(innerRecord.actualStartDate).format('DD-MMM-YYYY')
                    : ''
                }
                if (header === 'Act. End Date') {
                  return innerRecord.actualEndDate !== ''
                    ? moment(innerRecord.actualEndDate).format('DD-MMM-YYYY')
                    : ''
                }

                return innerRecord[innerColumnMappings[header]]?.toString().replace(/,/g, '')
              }
              return '-'
            })
            // Push the inner record data after the inner column headers
            csvRows.push(innerCsvRowData.join(','))
          })
        }

        // If no inner records exist, push an empty row for inner table data
        if (!outerRecord.taskEntryDtlEntity || outerRecord.taskEntryDtlEntity.length === 0) {
          csvRows.push(
            Array(innerTableHeaders.length)
              .fill('')
              .join(','),
          )
        }
      })
    }

    // Create CSV content
    const csvContent = csvRows.join('\n')

    // Create a Blob object for the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // Create a temporary URL for the Blob object
    const url = window.URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'exported_data.csv')

    // Simulate click on the link to trigger download
    link.click()
  }

  return (
    <div>
      <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6">
          <h5>Project Tracker</h5>
        </div>
        <div
          className={`${Styles.btns} col-sm-12 col-xs-12 col-md-6 col-lg-6 `}
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
        >
          <Buttons
            text={updateDsnHdr === '1' ? 'Pause Indent' : 'Start Indent'}
            type="primary"
            onClick={() => getUpdateDesign('1')}
          />
          <Buttons
            text={updateAssy === '1' ? 'Pause Material Request' : 'Start Material Request'}
            type="primary"
            onClick={() => getUpdateAssyMst('1')}
          />
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Buttons type="primary" text="Export to CSV" onClick={exportToCSV} />
      </div>
      <Table
        dataSource={data}
        columns={Column}
        expandable={{
          expandedRowRender: record =>
            expandedRecordKey === record.key && (
              <Table dataSource={record.taskEntryDtlEntity} columns={innerTable} />
            ),
          rowExpandable: record => record.taskEntryDtlEntity !== null,
          onExpand: (expanded, record) => {
            handleExpand(expanded ? record.key : null)
          },
        }}
        bordered
        pagination={{
          pageSizeOptions: ['10', '20', '30', '50', String(data?.length)],
          showSizeChanger: true,
          defaultPageSize: 10,
        }}
        scroll={{ y: 400 }}
      />
      <ProjectCostAnalysis />
    </div>
  )
}

export default ProjectTracker
