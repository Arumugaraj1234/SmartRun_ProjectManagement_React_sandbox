import React from 'react'
import { Card, Form, Input } from 'antd'
import moment from 'moment'
import { Table } from 'ant-table-extensions'

const Billingdispatch = () => {
  const data = [
    {
      'Project no.': 1,
      'Project Manager': 'John Doe',
      Customer: 'ABC Corporation',
      'Dispatch Plan': 'Plan A',
      'Project Name': 'Project X',
      'Contract Delivery Date (CDD)': '2024-04-20',
      'Payment Terms': 'Net 30',
      'Delivery Terms': 'Ex Works',
      Qty: 10,
      'Value In INR': 50000,
      'Project Status': 'Active',
      'Actual Dispatch Date': '2024-04-15',
      'Target Cost RMC INR': 10000,
      'Target Cost Service INR': 20000,
      'Target Contribution %': 50,
      'Actual Cost RMC INR': 8000,
      'Actual Cost Service INR': 18000,
      'Forecast Cost RMC INR': 12000,
      'Forecast Cost Service INR': 22000,
    },
    {
      'Project no.': 2,
      'Project Manager': 'Jane Smith',
      Customer: 'XYZ Corporation',
      'Dispatch Plan': 'Plan B',
      'Project Name': 'Project Y',
      'Contract Delivery Date (CDD)': '2024-04-25',
      'Payment Terms': 'Net 45',
      'Delivery Terms': 'FOB',
      Qty: 20,
      'Value In INR': 75000,
      'Project Status': 'Pending',
      'Actual Dispatch Date': '2024-04-10',
      'Target Cost RMC INR': 15000,
      'Target Cost Service INR': 25000,
      'Target Contribution %': 60,
      'Actual Cost RMC INR': 12000,
      'Actual Cost Service INR': 22000,
      'Forecast Cost RMC INR': 18000,
      'Forecast Cost Service INR': 28000,
    },
    // Add more data objects as needed...
  ]

  const columns1 = [
    {
      title: 'Project no.',
      dataIndex: 'Project no.',
      key: 'Project no.',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Project Manager',
      dataIndex: 'Project Manager',
      key: 'Project Manager',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Customer',
      dataIndex: 'Customer',
      key: 'Customer',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Dispatch Plan',
      dataIndex: 'Dispatch Plan',
      key: 'Dispatch Plan',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Project Name',
      dataIndex: 'Project Name',
      key: 'Project Name',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Contract Delivery Date (CDD)',
      dataIndex: 'Contract Delivery Date (CDD)',
      key: 'Contract Delivery Date (CDD)',
      width: 200,
      render: text => <span>{moment(text).format('DD-MMM-YYYY')}</span>,
    },
    {
      title: 'Payment Terms',
      dataIndex: 'Payment Terms',
      key: 'Payment Terms',
      width: 100,
    },
    {
      title: 'Delivery Terms',
      dataIndex: 'Delivery Terms',
      key: 'Delivery Terms',
      width: 100,
    },
    {
      title: 'Qty',
      dataIndex: 'Qty',
      key: 'Qty',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Value In INR',
      dataIndex: 'Value In INR',
      key: 'Value In INR',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Project Status',
      dataIndex: 'Project Status',
      key: 'Project Status',
      width: 100,
    },
    {
      title: 'Actual Dispatch Date',
      dataIndex: 'Actual Dispatch Date',
      key: 'Actual Dispatch Date',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Target Cost RMC INR',
      dataIndex: 'Target Cost RMC INR',
      key: 'Target Cost RMC INR',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Target Cost Service INR',
      dataIndex: 'Target Cost Service INR',
      key: 'Target Cost Service INR',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Target Contribution %',
      dataIndex: 'Target Contribution %',
      key: 'Target Contribution %',
      className: 'right-align-cell',
      width: 100,
    },
    {
      title: 'Actual Cost RMC INR',
      dataIndex: 'Actual Cost RMC INR',
      key: 'Actual Cost RMC INR',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Actual Cost Service INR',
      dataIndex: 'Actual Cost Service INR',
      key: 'Actual Cost Service INR',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Forecast Cost RMC INR',
      dataIndex: 'Forecast Cost RMC INR',
      key: 'Forecast Cost RMC INR',
      className: 'right-align-cell',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Forecast Cost Service INR',
      dataIndex: 'Forecast Cost Service INR',
      key: 'Forecast Cost Service INR',
      className: 'right-align-cell',
      // fixed: 'right',
      width: 100,
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
  ]
  return (
    <div className="mt-3" style={{ width: '100%', overflow: 'auto' }}>
      <Card title="Billingdispatch">
        {/* <h5>Billingdispatch</h5> */}
        <Form>
          <div className="row">
            <div className="col-4">
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Turnover target FY - 2023-24 (cr.)"
                label="Turnover target FY - 2023-24 (cr.)"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Projects Under Execution (cr.)"
                label="Projects Under Execution (cr.)"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Prospective Projects (cr.)"
                label="Prospective Projects (cr.)"
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Order Intake (cr.)"
                label="Order Intake (cr.)"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Turnover Till Date (cr.)"
                label="Turnover Till Date (cr.)"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="YTD FY - 2023-24 (cr.)"
                label="YTD FY - 2023-24 (cr.)"
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-1" />
            <div className="col-3">
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Record no "
                label="Record no "
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="PM/R/001"
                label="PM/R/001"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Rev no"
                label="Rev no"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                className="mb-0"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                name="Rev Date"
                label="Rev Date"
              >
                <Input type="text" />
              </Form.Item>
            </div>
          </div>
        </Form>

        <div style={{ width: '200vh' }}>
          <Table columns={columns1} dataSource={data} scroll={{ x: 'max-content' }} bordered />
        </div>
      </Card>
    </div>
  )
}

export default Billingdispatch
