import React, { useState, useEffect } from 'react'
// import { DownOutlined } from '@ant-design/icons';
import { Table, Button, Checkbox } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const ExtendTable = ({ docTypeSelect, processCode, docGroupval, handleSetAsDefault }) => {
  const employeeId = store.get('employeeId')
  const [selectedRow, setSelectedRow] = useState(null)
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [jsonResponse, setJsonResponse] = useState([])
  const tenantID = store.get('tenantId')

  useEffect(() => {
    getVersionDtls()
  }, [])

  const getVersionDtls = async () => {
    const props = {
      docGroup: docGroupval,
      docType: docTypeSelect,
      processCode,
      tenantId: tenantID,
    }
    const response = await indentFileUpload({
      requestPath: 'getLifeCylceMstVersionDtls',
      requestData: props,
    })
    if (response.responseCode === '200') {
      setJsonResponse(response.responseData)
    } else {
      setJsonResponse([])
    }
  }

  const handlesetdefault = () => {
    if (selectedRow) {
      const newData = selectedRow?.data.map(item => {
        return { ...item, empId: employeeId }
      })
      handleSetAsDefault(newData)
    } else {
      messageReturn(626)
    }
  }

  // const handleDelete = () => {
  // }

  const expandedRowRender = record => {
    const columns = [
      {
        title: 'Document Type',
        dataIndex: 'docTypeDesc',
        key: 'docTypeDesc',
      },
      // {
      //   title: 'Process Code',
      //   dataIndex: 'procesCode',
      //   key: 'procesCode',
      // },

      {
        title: 'Doc Status Description',
        dataIndex: 'docStatusDesc',
        key: 'docStatusDesc',
      },
      {
        title: 'Current Sequence',
        dataIndex: 'curSeq',
        key: 'curSeq',
      },
      {
        title: 'Approving Designation',
        dataIndex: 'apprDesi',
        key: 'apprDesi',
      },
      {
        title: 'Last Sequence',
        dataIndex: 'lastSeq',
        key: 'lastSeq',
        render: text => (text ? (parseInt(text, 10) === 1 ? 'True' : 'False') : '-'),
      },
      {
        title: 'Next Sequence',
        dataIndex: 'nextSeq',
        key: 'nextSeq',
      },
      {
        title: 'Cancel Sequence',
        dataIndex: 'cancelSeq',
        key: 'cancelSeq',
      },
      {
        title: 'Is Editable',
        dataIndex: 'isEditable',
        key: 'isEditable',
        render: text => (text ? (parseInt(text, 10) === 1 ? 'True' : 'False') : '-'),
      },
      {
        title: 'Sequence Batch',
        dataIndex: 'seqBatch',
        key: 'seqBatch',
      },
    ]
    return <Table columns={columns} dataSource={record.data} pagination={false} />
  }

  const columns = [
    {
      title: 'Select Version',
      dataIndex: 'select',
      key: 'select',
      width: '20%',
      render: (_, record) => (
        <Checkbox
          checked={selectedRow ? selectedRow.key === record.key : false}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: '30%',
    },
    {
      title: 'Version Updatedtime',
      dataIndex: 'versiondatetime',
      key: 'versiondatetime',
      width: '30%',
      render: text => (text ? moment(text).format('DD-MMM-YYYY HH:mm') : '-'),
    },
    {
      title: 'Version Updatedby',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: '30%',
    },
  ]

  const data = jsonResponse.map((item, index) => ({
    key: index.toString(),
    ...item,
  }))
  // const handleReset = () => {
  //   setSelectedRow(null);
  //   setSelectedRowKeys(null);
  // };

  // const rowSelection = {
  //   type: 'checkbox',
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRow(selectedRows[0]);
  //     setSelectedRowKeys(selectedRowKeys)
  //   },
  // };

  // const handleSelectChange = (newSelectedRowKeys, newSelectedRows) => {
  //   if (newSelectedRowKeys.length === 0) {
  //     // Deselect the current row
  //     setSelectedRow(null);
  //     setSelectedRowKeys([]);
  //   } else if (selectedRow && selectedRow.key === newSelectedRowKeys[0]) {
  //     // If the same row is selected again, deselect it
  //     setSelectedRow(null);
  //     setSelectedRowKeys([]);
  //   } else {
  //     // Select the new row
  //     setSelectedRow(newSelectedRows[0]);
  //     setSelectedRowKeys(newSelectedRowKeys);
  //   }
  // };

  // const CustomCheckbox = ({ checked, onChange }) => {
  //   return <Checkbox checked={checked} onChange={onChange} style={{ display: 'none' }} />;
  // };

  const handleCheckboxChange = record => {
    if (selectedRow && selectedRow.key === record.key) {
      setSelectedRow(null)
      // setSelectedRowKeys([])
    } else {
      setSelectedRow(record)
      // setSelectedRowKeys([record.key])
    }
  }
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: handleSelectChange,
  //   hideSelectAllCheckbox: true,
  //   // Replace the checkbox in the header with the custom one
  //   checkboxProps: {
  //     disabled: true, // disable the checkbox in the header
  //     children: <CustomCheckbox />,
  //   },
  // };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'end' }}>
        <Button type="primary" onClick={handlesetdefault}>
          Set as default
        </Button>
        {/* <Button type="primary" onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={handleReset}>
          Reset
        </Button> */}
      </div>
      <Table
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
        dataSource={data}
        pagination={false}
        scroll={{ y: 300 }}
      />
    </>
  )
}

export default ExtendTable
