import React, { useState } from 'react'
import moment from 'moment'
import { Table } from 'antd'
// import { useMediaQuery } from 'react-responsive'

const Enquiryorderchart = ({ Datas }) => {
  const [filtersinfo, setfilterinfo] = useState([])
  // const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  // const [tableWidth, setTableWidth] = useState('300px')

  // useEffect(() => {
  //   const handleResize = () => {
  //     const screenWidth = window.innerWidth
  //     setTableWidth(`${screenWidth - 30}px`)
  //   }

  //   window.addEventListener('resize', handleResize)
  //   handleResize() // Initial call to set width on component mount

  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const EnquiryCode1 = []
  const CustomerName1 = []
  const ProjectName1 = []
  const CreatedDate1 = []
  const CompletedDate1 = []
  const HandoverDate1 = []
  const dateDiff1 = []

  if (Datas && Datas.length > 0) {
    Datas.map(h => EnquiryCode1.push(h.enqCode))
    Datas.map(h => CustomerName1.push(h.customerName))
    Datas.map(h => ProjectName1.push(h.projectName))
    Datas.map(h => CreatedDate1.push(h.createdDate))
    Datas.map(h => CompletedDate1.push(h.completedDate))
    Datas.map(h => HandoverDate1.push(h.handoverDate))
    Datas.map(h => dateDiff1.push(h.dateDiff))
  }
  const distinct = (value, index, self) => self.indexOf(value) === index

  const EnquiryCode2 = EnquiryCode1.filter(distinct)
  const CustomerName2 = CustomerName1.filter(distinct)
  const ProjectName2 = ProjectName1.filter(distinct)
  const CreatedDate2 = CreatedDate1.filter(distinct)
  const CompletedDate2 = CompletedDate1.filter(distinct)
  const HandoverDate2 = HandoverDate1.filter(distinct)
  const dateDiff2 = dateDiff1.filter(distinct)

  const EnquiryCode3 = []
  const CustomerName3 = []
  const ProjectName3 = []
  const CreatedDate3 = []
  const CompletedDate3 = []
  const HandoverDate3 = []
  const dateDiff3 = []

  EnquiryCode2.map(element =>
    EnquiryCode3.push({
      text: element,
      value: element,
    }),
  )
  CustomerName2.map(element =>
    CustomerName3.push({
      text: element,
      value: element,
    }),
  )
  ProjectName2.map(element =>
    ProjectName3.push({
      text: element,
      value: element,
    }),
  )
  CreatedDate2.map(element =>
    CreatedDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : 'NA',
      value: element,
    }),
  )
  CompletedDate2.map(element =>
    CompletedDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : 'NA',
      value: element,
    }),
  )
  HandoverDate2.map(element =>
    HandoverDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : 'NA',
      value: element,
    }),
  )
  dateDiff2.map(element =>
    dateDiff3.push({
      text: element,
      value: element,
    }),
  )

  const columns = [
    {
      title: 'Enquiry Code',
      dataIndex: 'enqCode',
      key: 'enqCode',
      filters: EnquiryCode3,
      filteredValue: filtersinfo.enqCode,
      onFilter: (value, record) => record?.enqCode === value,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '20%',
      filters: CustomerName3,
      filteredValue: filtersinfo.customerName,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '20%',
      filters: ProjectName3,
      filteredValue: filtersinfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
    },
    {
      title: 'Enquiry Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      filters: CreatedDate3,
      filteredValue: filtersinfo.createdDate,
      onFilter: (value, record) => record?.createdDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : ''),
    },
    {
      title: 'Order Won Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      filters: CompletedDate3,
      filteredValue: filtersinfo.completedDate,
      onFilter: (value, record) => record?.completedDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : 'NA'),
    },
    {
      title: 'Handover Date',
      dataIndex: 'handoverDate',
      key: 'handoverDate',
      filters: HandoverDate3,
      filteredValue: filtersinfo.handoverDate,
      onFilter: (value, record) => record?.handoverDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : 'NA'),
    },
    {
      title: 'Convertion Days',
      dataIndex: 'dateDiff',
      key: 'dateDiff',
      className: 'right-align-cell',
      filters: dateDiff3,
      filteredValue: filtersinfo.dateDiff,
      onFilter: (value, record) => record?.dateDiff === value,
    },
  ]

  return (
    <div className="chart_card table_row_chart">
      <div>
        <Table
          columns={columns}
          size="small"
          dataSource={Datas}
          scroll={{ y: 220 }}
          pagination={false}
          bordered
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Enquiryorderchart
