import React, { useState, useEffect } from 'react'
import store from 'store'
// import Table from '../../../../components/common/TableComponent'
import moment from 'moment'
import { FileExcelOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import { Button, Input } from 'antd'
import { useMediaQuery } from 'react-responsive'
import currentDateTime from '../../../../currentDateTime'
// import style from './style.module.scss';

const SaleTableRecord = ({ data, onClick }) => {
  const removeCommas = value => {
    if (!value) return 0
    return Number(value.replace(/,/g, '') || 0)
  }

  const Menulistdata = store.get('MenuListData')
  const [filtersinfo, setfilterinfo] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const [tableData, setTableData] = useState(data)
  const [grandTotal, setGrandTotal] = useState(0)

useEffect(() => {
  setTableData(data);

  // Only try to calculate total if data is a non-empty array
  if (Array.isArray(data)) {
    const totalFinalCost = data.reduce((sum, item) => {
      return sum + removeCommas(item.finalCost);
    }, 0);
    setGrandTotal(totalFinalCost);
  } else {
    setGrandTotal(0); // or handle error/log
  }

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    setTableWidth(`${screenWidth - 30}px`);
  };

  window.addEventListener('resize', handleResize);
  handleResize();

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, [data]);


  const handleChange = (pagination, filters, sorter, extra) => {
    setfilterinfo(filters)
    const { currentDataSource } = extra
    const totalFinalCost1 = currentDataSource.reduce((sum, item) => {
      return sum + removeCommas(item.finalCost)
    }, 0)
    setGrandTotal(totalFinalCost1)
  }
  const handleCardClick = record => {
    if (onClick) {
      onClick(record)
    }
  }

  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      const dateSp = dateStringval.split('-')
      returndata = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]}`
    } else {
      returndata = 'NA'
    }
    return returndata
  }

  const enquiryCode1 = []
  const customer1 = []
  const projectname1 = []
  const enquirystg1 = []
  const enquirysts1 = []
  const leadthrough1 = []
  const rfqdate1 = []
  const createdDateTime1 = []
  const ordbooking1 = []
  const pomonth1 = []
  const enqtype1 = []
  const instype1 = []
  const empnames1 = []

  if (tableData) {
    tableData.map(h => {
      return enquiryCode1.push(h.enquiryCode)
    })
    tableData.map(h => {
      return customer1.push(h.customerName)
    })
    tableData.map(h => {
      return projectname1.push(h.projectName)
    })
    tableData.map(h => {
      return enquirystg1.push(h.stgDesc)
    })
    tableData.map(h => {
      return enquirysts1.push(h.hdrStatusDesc)
    })
    tableData.map(h => {
      return leadthrough1.push(h.leadDtl)
    })
    tableData.map(h => {
      return rfqdate1.push(h.enquiryDate)
    })
    tableData.map(h => {
      return createdDateTime1.push(h.createdDateTime)
    })
    tableData.map(h => {
      return ordbooking1.push(h.expectedPoDate)
    })
    tableData.map(h => {
      return pomonth1.push(h.tentativePoMonth)
    })
    tableData.map(h => {
      return enqtype1.push(h.enquiryType)
    })
    tableData.map(h => {
      return instype1.push(h.industrialType)
    })
    tableData.map(h => {
      return empnames1.push(h.employeeNames)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const enquirycod2 = enquiryCode1.filter(distinct)
  const customer2 = customer1.filter(distinct)
  const projectname2 = projectname1.filter(distinct)
  const enquirystg2 = enquirystg1.filter(distinct)
  const enquirysts2 = enquirysts1.filter(distinct)
  const leadthrough2 = leadthrough1.filter(distinct)
  const rfqdate2 = rfqdate1.filter(distinct)
  const createdDateTime2 = createdDateTime1.filter(distinct)
  const ordbooking2 = ordbooking1.filter(distinct)
  const pomonth2 = pomonth1.filter(distinct)
  const enqtype2 = enqtype1.filter(distinct)
  const instype2 = instype1.filter(distinct)
  const empnames2 = empnames1.filter(distinct)

  const enquirycod3 = []
  const customer3 = []
  const projectname3 = []
  const enquirystg3 = []
  const enquirysts3 = []
  const leadthrough3 = []
  const rfqdate3 = []
  const createdDateTime3 = []
  const ordbooking3 = []
  const pomonth3 = []
  const enqtype3 = []
  const instype3 = []
  const empnames3 = []

  enquirycod2.map(element => {
    return enquirycod3.push({
      text: element,
      value: element,
    })
  })
  customer2.map(element => {
    return customer3.push({
      text: element,
      value: element,
    })
  })
  projectname2.map(element => {
    return projectname3.push({
      text: element,
      value: element,
    })
  })
  enquirystg2.map(element => {
    return enquirystg3.push({
      text: element,
      value: element,
    })
  })
  enquirysts2.map(element => {
    return enquirysts3.push({
      text: element,
      value: element,
    })
  })
  leadthrough2.map(element => {
    return leadthrough3.push({
      text: element,
      value: element,
    })
  })
  rfqdate2.map(element => {
    return rfqdate3.push({
      text: dateformatter(element),
      value: element,
    })
  })
  createdDateTime2.map(element => {
    return createdDateTime3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : 'NA',
      value: element,
    })
  })
  ordbooking2.map(element => {
    return ordbooking3.push({
      text: dateformatter(element),
      value: element,
    })
  })
  pomonth2.map(element => {
    return pomonth3.push({
      text: element,
      value: element,
    })
  })
  enqtype2.map(element => {
    return enqtype3.push({
      text: element,
      value: element,
    })
  })
  instype2.map(element => {
    return instype3.push({
      text: element,
      value: element,
    })
  })
  empnames2.map(element => {
    return empnames3.push({
      text: element,
      value: element,
    })
  })

  const SaleColumns = [
    {
      title: 'Serial No',
      dataIndex: 'sno',
      key: 'sno',
      align: 'center',
      width: '100px',
      fixed: 'left',
    },
    {
      title: 'Enquiry No',
      dataIndex: 'enquiryCode',
      key: 'enquiryCode',
      align: 'center',
      width: '120px',
      fixed: 'left',
      filters: enquirycod3,
      filteredValue: filtersinfo.enquiryCode,
      onFilter: (value, record) => record?.enquiryCode === value,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '120px',
      fixed: 'left',
      filters: customer3,
      filteredValue: filtersinfo.customerName,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: 'Project Name',
      key: 'projectName',
      dataIndex: 'projectName',
      filters: projectname3,
      width: '120px',
      fixed: 'left',
      filteredValue: filtersinfo.projectDescription,
      onFilter: (value, record) => record?.projectDescription === value,
    },
    {
      title: 'Enquiry Stage',
      dataIndex: 'stgDesc',
      key: 'stgDesc',
      width: '120px',
      fixed: 'left',
      filters: enquirystg3,
      filteredValue: filtersinfo.stgDesc,
      onFilter: (value, record) => record?.stgDesc === value,
    },
    {
      title: 'Enquiry Status',
      dataIndex: 'hdrStatusDesc',
      key: 'hdrStatusDesc',
      width: '120px',
      fixed: 'left',
      filters: enquirysts3,
      filteredValue: filtersinfo.hdrStatusDesc,
      onFilter: (value, record) => record?.hdrStatusDesc === value,
    },
    {
      title: 'Enquiry Type',
      dataIndex: 'enquiryType',
      key: 'enquiryType',
      width: '120px',
      fixed: 'left',
      filters: enqtype3,
      filteredValue: filtersinfo.enquiryType,
      onFilter: (value, record) => record?.enquiryType === value,
    },
    {
      title: 'Industrial Type',
      dataIndex: 'industrialType',
      key: 'industrialType',
      width: '120px',
      fixed: 'left',
      filters: instype3,
      filteredValue: filtersinfo.industrialType,
      onFilter: (value, record) => record?.industrialType === value,
    },
    {
      title: 'Lead Through',
      dataIndex: 'leadDtl',
      key: 'leadDtl',
      width: '160px',
      filters: leadthrough3,
      filteredValue: filtersinfo.leadDtl,
      onFilter: (value, record) => record?.leadDtl === value,
    },
    {
      title: 'RFQ Date',
      key: 'enquiryDate',
      dataIndex: 'enquiryDate',
      width: '120px',
      render: text => <a>{dateformatter(text)}</a>,
      filters: rfqdate3,
      filteredValue: filtersinfo.enquiryDate,
      onFilter: (value, record) => moment(record.enquiryDate).isSame(moment(value), 'day'),
    },
    {
      title: 'Created Date',
      key: 'createdDateTime',
      dataIndex: 'createdDateTime',
      width: '120px',
      render: text => <a>{moment(text).format('DD-MMM-YYYY')}</a>,
      filters: createdDateTime3,
      filteredValue: filtersinfo.createdDateTime,
      onFilter: (value, record) => moment(record.createdDateTime).isSame(moment(value), 'day'),
    },
    {
      title: 'Order Booking',
      key: 'expectedPoDate',
      dataIndex: 'expectedPoDate',
      width: '160px',
      render: text => <a>{dateformatter(text)}</a>,
      filters: ordbooking3,
      filteredValue: filtersinfo.expectedPoDate,
      onFilter: (value, record) => moment(record.expectedPoDate).isSame(moment(value), 'day'),
    },
    {
      title: 'Tentative PO Month',
      key: 'tentativePoMonth',
      dataIndex: 'tentativePoMonth',
      width: '160px',
      render: text => <a>{text}</a>,
      filters: pomonth3,
      filteredValue: filtersinfo.tentativePoMonth,
      onFilter: (value, record) => record?.tentativePoMonth === value,
    },
    {
      title: `Order Values ${Menulistdata[0].currency}`,
      key: 'finalCost',
      dataIndex: 'finalCost',
      className: 'right-align-cell',
      width: '160px',
      // render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
      render: text => <span>{text}</span>,
    },
    {
      title: 'Client Contact',
      dataIndex: 'salesContact',
      className: 'right-align-cell',
      width: '130px',
      // render: salesContacts => {
      //   if (salesContacts && salesContacts.length > 0) {
      //     return salesContacts[0].contactNo
      //   }
      //   return ''
      // },
    },
    {
      title: 'Assigned Team Member',
      dataIndex: 'employeeNames',
      key: 'employeeNames',
      width: '160px',
      filters: empnames3,
      filteredValue: filtersinfo.employeeNames,
      onFilter: (value, record) => record?.employeeNames === value,
      render: text => <span>{text}</span>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '100px',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Button type="primary" onClick={() => handleCardClick(record)}>
            Details
          </Button>
        )
      },
    },
  ]

  const handleSearch = e => {
    const filtered = data.filter(item =>
      Object.keys(item).some(key =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
      ),
    )
    setTableData(filtered)
  }

  return (
    <div className="card" style={isMobile ? { width: tableWidth } : { marginTop: '10px' }}>
      <div className="card-body" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
        <div className="table" style={{ marginTop: '15px' }}>
          <div style={{ marginTop: '15px' }}>
            <Input.Search
              style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
              placeholder="Search here..."
              enterButton
              // onSearch={handleSearch}
              onChange={e => handleSearch(e)}
            />
            <Table
              columns={SaleColumns}
              dataSource={tableData}
              exportableProps={{
                fileName: `Enquiries${currentDateTime}`,
                // explicit field map so the CSV can include columns (Contact Name/Email/Number)
                // that aren't shown in the on-screen table
                fields: {
                  sno: 'Serial No',
                  enquiryCode: 'Enquiry No',
                  customerName: 'Customer',
                  projectName: 'Project Name',
                  stgDesc: 'Enquiry Stage',
                  hdrStatusDesc: 'Enquiry Status',
                  enquiryType: 'Enquiry Type',
                  industrialType: 'Industrial Type',
                  leadDtl: 'Lead Through',
                  enquiryDate: 'RFQ Date',
                  createdDateTime: 'Created Date',
                  expectedPoDate: 'Order Booking',
                  tentativePoMonth: 'Tentative PO Month',
                  finalCost: `Order Values ${Menulistdata[0].currency}`,
                  salesContact: 'Client Contact',
                  employeeNames: 'Assigned Team Member',
                  contactName: 'Contact Name',
                  contactEmail: 'Email ID',
                  contactNo: 'Contact Number',
                },
                btnProps: {
                  type: 'primary',
                  icon: <FileExcelOutlined />,
                  children: <span>Export to CSV</span>,
                },
              }}
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [data?.length]],
                showSizeChanger: true,
                defaultPageSize: 10,
              }}
              scroll={{ y: 400 }}
              onChange={handleChange}
              footer={() => (
                <div style={{ fontSize: '16px', marginLeft: '32px' }}>
                  <span>Grand Total : {parseFloat(grandTotal).toLocaleString('en-IN')}</span>
                </div>
              )}
              bordered
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleTableRecord
