import { FileExcelOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Table } from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import VendorPaymentChart from 'modules/finance/components/Dashboard/VendorPaymentChart'
import React, { useState } from 'react'
import { FaCircleInfo } from 'react-icons/fa6'
import { MdPayments, MdOutlinePending } from 'react-icons/md'
import currentDateTime from 'currentDateTime'
import BalanceAvailable from './BalanceAvailableModal'
import { convertToCSV, downloadCSV } from './ExportToCsv'

const PayableSection = ({ vendorTableData, vendorPaymentData,vendorDetailsData,unit }) => {
  const [balanceAvailModal, setBalanceAvailModal] = useState(false)
  const [filteredData, setFilteredData] = useState(null) 
    // ✅ handle table changes (filters, sort, pagination)
  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (extra.action === 'filter') {
      setFilteredData(extra.currentDataSource) // filtered rows
    }
  }
  const dataForChart = filteredData && filteredData.length > 0 
    ? filteredData 
    : vendorTableData
  const getUniqueFilters = (data, key) => {
    const seen = new Set()
    return data
      .map(item => item?.[key])
      .filter(val => val !== undefined && val !== null && !seen.has(val) && seen.add(val))
      .map(val => ({ text: val, value: val }))
  }
  const vendorNameFilter = getUniqueFilters(vendorTableData, 'vendorName')
  const vendorNoFilter = getUniqueFilters(vendorTableData, 'projCode')

  console.log(vendorTableData, 'Vendor Details in payable')
  const CardComponent = ({
    icon: Icon,
    title,
    planned,
    onClick,
    displayicon,
    bgicon,
    bgicondiv,
  }) => (
    <div
      className="card orange"
      style={{
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        marginBottom: '10px',
        height: '110px',
        padding: '10px 20px',
        position: 'relative', // for absolutely positioned info icon
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Info icon in top-right */}
      {displayicon && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
            zIndex: 1,
          }}
        >
          <FaCircleInfo onClick={onClick} />
        </div>
      )}

      {/* Icon center aligned */}
      <div
        className="card icon"
        style={{
          backgroundColor: bgicondiv,
          alignSelf: 'center',
          marginBottom: '5px',
        }}
      >
        <Icon style={{ color: bgicon }} />
      </div>

      {/* Title and Planned count */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // textAlign: 'center',
        }}
      >
        <h5 style={{ fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{title}</h5>
        <h5 style={{ fontWeight: 'bold', margin: 0 }}>{planned}</h5>
      </div>
    </div>
  )

  const getBalanceAvailableDtls = () => {
    setBalanceAvailModal(true)
  }

 const formatValue = val => {
    const num = Number(val) || 0

    if (num === 0) {
      return '0'
    }

    // Helper to truncate without rounding
    const truncateToTwo = value => Math.floor(value * 100) / 100

    if (unit === 'crores') {
      const crores = num / 10000000
      return `${crores < 1 ? crores.toFixed(2) : truncateToTwo(crores)} Cr`
    }

    if (unit === 'lakhs') {
      const lakhs = num / 100000
      return `${lakhs < 1 ? lakhs.toFixed(2) : truncateToTwo(lakhs)} L`
    }

    return `${Math.round(num).toLocaleString('en-IN')}`
  }
  const formatWithRupee = value => `₹ ${formatValue(value)}`

  const columns1 = [
    {
      title: 'Project No​',
      dataIndex: 'projCode',
      key: 'projCode',
      render: value => value || '-',
        filters: vendorNoFilter,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
        filters: vendorNameFilter,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'Amount Payable',
      dataIndex: 'amountPayable',
      align: 'right',
      key: 'amountPayable',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Amount Due​',
      dataIndex: 'amountDue',
      align: 'right',
      key: 'amountDue',
       render: value => (value ? formatValue(value) : '0'),
    },
  ]
  const cleanupVendorDueData = dataSource => {
    return dataSource.map((row) => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          // Escape special characters (double quotes and commas)
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
        }
        return value
      }
      return {
        'S.No': escapeValue(row.sno),
        'Project No': escapeValue(row.projCode || '-'),
        'Vendor Name': escapeValue(row.vendorName),
        'Amount Payable': Number(row.amountPayable || 0),
        'Amount Due': Number(row.amountDue || 0),
      }
    })
  }

  const handleExportVendorDueCSV = () => {
    const cleanedData = cleanupVendorDueData(vendorTableData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Vendor_Payment_Due_${currentDateTime}.csv`)
  }

  const renderBalanceAvailComponent = () => {
    return (
      <BalanceAvailable
        onmodalCancel={() => {
          setBalanceAvailModal(false)
        }}
        // getSelectedFromDate={fromDate}
        // getSelectedToDate={toDate}
        project={vendorDetailsData}
      />
    )
  }
  return (
    <Row gutter={[30, 30]}>
      <Col
        xs={24}
        xl={8}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <h4 style={{ fontWeight: 'bold', marginBottom: '35px', textAlign: 'left' }}>Payable</h4>

        <CardComponent
          icon={MdPayments}
          title="Vendor Payment done so far​"
          planned={`₹ ${formatValue(vendorPaymentData?.[0]?.paidSoFar)}`}
          bgicondiv="#c8e6c9"
          bgicon="#1b5e20"
          //   onClick={getBalanceAvailableDtls}
        />
        <CardComponent
          icon={MdOutlinePending}
          title="Vendor Payment due​"
          planned={`₹ ${formatValue(vendorPaymentData?.[0]?.amountDue)}`}
          bgicondiv="#ffcdd2"
          bgicon="#b71c1c"
        />
      </Col>

      <Col xs={24} xl={16}>
        <Card
          bordered={false}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            borderRadius: '10px',
            width: '100%',
          }}
        >
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => handleExportVendorDueCSV()}
            style={{ margin: '10px 0px', float: 'left' }}
          >
            Export to CSV
          </Button>
          <Button
            type="primary"
            onClick={() => getBalanceAvailableDtls()}
            style={{ margin: '10px 0px', float: 'right' }}
          >
            View Details
          </Button>

          <div className="tableheight" style={{ width: '100%' }}>
            <Table
              columns={columns1}
              dataSource={vendorTableData}
              size="small"
              pagination={false}
              scroll={{ y: 220 }}
              onChange={handleTableChange}
              style={{ width: '100%', minHeight: '250px' }}
              summary={() => {
                let totalAmountPayable = 0
                let totalAmountDue = 0

                // eslint-disable-next-line no-unused-expressions
                vendorTableData?.forEach(item => {
                  const payable = Number(item.amountPayable) || 0
                  const due = Number(item.amountDue) || 0
                  totalAmountPayable += payable
                  totalAmountDue += due
                })

                return (
                  <Table.Summary.Row style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
                    <Table.Summary.Cell align="left">Total</Table.Summary.Cell>
                    <Table.Summary.Cell /> {/* Vendor Name column - leave blank */}
                    <Table.Summary.Cell align="right">
                      {formatWithRupee(totalAmountPayable)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right">
                      {formatWithRupee(totalAmountDue)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )
              }}
            />
          </div>
        </Card>
      </Col>

      <Col span={24}>
        <Card
          bordered={false}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            borderRadius: '10px',
            width: '100%',
          }}
        >
          <VendorPaymentChart data={dataForChart} />
        </Card>
      </Col>

      {balanceAvailModal ? (
        <ModalPopup
          isModalVisible={balanceAvailModal}
          FieldsComponent={renderBalanceAvailComponent}
          text="Vendor Payment Due"
          onCancel={() => {
            setBalanceAvailModal(false)
          }}
          width="500"
        />
      ) : null}
    </Row>
  )
}

export default PayableSection
