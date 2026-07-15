import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import store from 'store'
import ApproveOrReject from 'components/common/ApproveRejectBtnComponent'
import { PlusOutlined } from '@ant-design/icons'
import Popuptable from 'components/shared/PopuptableComponent'
import Button from 'components/shared/ButtonComponent'
import Table from 'components/common/TableComponent'
import AddNewDocument from 'modules/sales/components/AddNewDocument'
import {
  approveddocumentData,
  newapproveDocument,
} from 'services/common/AppeovedDocumentService/approveddocumentService'
import DownloadDocuments from 'components/common/FileDownloadComponent/index'
import { useMediaQuery } from 'react-responsive'

const moment = require('moment')

const EnquiryValidated = ({
  insertfunc,
  isEditableBtn,
  componenttoRender,
  type,
  saveButtonStatus,
  Value,
  uploadDocType,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [tableData, setTableData] = useState([])
  const [unapprovedTabledData, setUnapprovedTableData] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  const [detailData, setDetailData] = useState({})
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedKey, setSelectedKey] = useState(null)

  const Tab = store.get('Tab')
  const { tenantId, mstId, stgCode, docTypeCode, isEditable, slaveId, processCode } = Tab
  const employeeId = store.get('employeeId')
  const doctype = uploadDocType === undefined ? 'DC035' : uploadDocType
  const enquiryid = store.get('EnquiryID')
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' })

  useEffect(() => {
    approvedList()
    unapprovedList()
  }, [])
  console.log(mstId)
  const approvedList = async () => {
    try {
      const response = await approveddocumentData({
        enquiryId: enquiryid,
        stageCode: stgCode,
        approved: '1',
        tenantId,
        docTypeCode: doctype,
        employeeId,
      })

      if (response) {
        setTableData(response.responseData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const unapprovedList = async () => {
    try {
      const response = await approveddocumentData({
        enquiryId: enquiryid,
        stageCode: stgCode,
        approved: '0',
        tenantId,
        docTypeCode: doctype,
        employeeId,
      })

      if (response) {
        setUnapprovedTableData(response.responseData)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const OpenDetailCard = rowData => {
    if (detailCard) {
      setdetailCard(false)
    } else {
      setdetailCard(true)
      setDetailData(rowData.approvalDetails)
    }
  }

  const OpenApproveCard = rowData => {
    const approvenewdata = async () => {
      const obj = {
        empID: employeeId,
        tenantId,
        dmId: rowData.dmId,
        docTypeCode: doctype,
        pmId: processCode,
      }
      try {
        const response = await newapproveDocument({
          requestData: obj,
        })

        if (response) {
          approvedList()
          unapprovedList()
          message.success(response.responseMessage)
        }
      } catch (error) {
        console.error(error)
      }
    }
    approvenewdata()
  }
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleSubmit = () => {
    handleCancel()
    approvedList()
    unapprovedList()
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const style = {
    width: isMobile ? '280px' : 'auto',
  }
  const detailcolumn = [
    {
      title: 'Ver.',
      dataIndex: 'version',
      key: 'version',
      className: 'right-align-cell',
    },
    {
      title: 'Status',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY'),
    },
    {
      title: 'Updated by',
      dataIndex: 'updatedby',
      key: 'updatedby',
    },
  ]

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Document Type ',
      dataIndex: 'uploadDocument',
      key: 'uploadDocument',
    },
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
    },
    {
      title: 'Doc ID',
      dataIndex: 'dmId',
      key: 'dmId',
      className: 'right-align-cell',
    },
    {
      title: Value ? 'Value(₹)' : 'Remarks',
      key: 'remarks',
      dataIndex: 'remarks',
      render: (text, record) => {
        return Value ? (
          <span>
            {Number(record.remarks).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
          </span>
        ) : (
          <span>{record.remarks}</span>
        )
      },
    },
    {
      title: 'Uploaded On',
      key: 'createdDate',
      dataIndex: 'createdDate',
      render: (text, record) => moment(record.createdDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Uploaded By',
      key: 'createdBy',
      dataIndex: 'createdBy',
    },
    {
      title: 'Ver.',
      key: 'version',
      dataIndex: 'version',
      className: 'right-align-cell',
    },
    {
      title: 'Action',
      key: 'Apprveaction',
      dataIndex: 'Apprveaction',
      align: 'center',
      render: (text, record, index) => {
        const actionColumnKey = 'Apprveaction'
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DownloadDocuments
              refid={record.dmId}
              tenanrId={tenantId}
              fileDocode={record.uploadDocType}
              docTypeCode={record.document}
              isPdf={record.isPdf}
            />
            <span style={{ margin: '0 8px' }} />
            {detailCard && index === selectedIndex && selectedKey === 'Apprveaction' && (
              <Popuptable
                onClose={() => setdetailCard(false)}
                cardLabel="Approved Details"
                component={
                  <div style={style}>
                    <Table columns={detailcolumn} data={detailData} />
                  </div>
                }
                visible={detailCard}
              />
            )}
            <Button
              type="primary"
              text="Details"
              onClick={() => {
                OpenDetailCard(record)
                setSelectedIndex(index)
                setSelectedKey(actionColumnKey)
              }}
            />
          </div>
        )
      },
    },
  ]

  const UnapprovedColumn = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Document Type ',
      dataIndex: 'uploadDocument',
      key: 'uploadDocument',
    },
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
    },
    {
      title: Value ? 'Value(₹)' : 'Remarks',
      key: 'remarks',
      dataIndex: 'remarks',
      render: (text, record) => {
        return Value ? (
          <span>
            {Number(record.remarks).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
          </span>
        ) : (
          <span>{record.remarks}</span>
        )
      },
    },

    {
      title: 'Uploaded On',
      key: 'createdDate',
      dataIndex: 'createdDate',
      render: (text, record) => moment(record.createdDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Uploaded By',
      key: 'createdBy',
      dataIndex: 'createdBy',
    },
    {
      title: 'Ver.',
      key: 'version',
      dataIndex: 'version',
      className: 'right-align-cell',
    },
    {
      title: 'Action',
      key: 'unApprveaction',
      dataIndex: 'unApprveaction',
      align: 'center',
      render: (text, record, index) => {
        const actionColumnKey = 'unApprveaction'
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DownloadDocuments
              refid={record.dmId}
              tenanrId={tenantId}
              fileDocode={record.uploadDocType}
              docTypeCode={record.document}
              isPdf={record.isPdf}
            />
            <span style={{ margin: '0 8px' }} />
            {detailCard && index === selectedIndex && selectedKey === 'unApprveaction' && (
              <Popuptable
                onClose={() => setdetailCard(false)}
                cardLabel="Unapproved Details"
                component={
                  <div style={style}>
                    <Table columns={detailcolumn} data={detailData} />
                  </div>
                }
                visible={detailCard}
              />
            )}
            <Button
              type="primary"
              text="Details"
              onClick={() => {
                OpenDetailCard(record)
                setSelectedIndex(index)
                setSelectedKey(actionColumnKey)
              }}
            />
            <span style={{ margin: '0 8px' }} />
            {record.approveBtnEnabled === 1 && isEditable === '1' && (
              <Button
                type="primary"
                text="Approve"
                onClick={() => {
                  OpenApproveCard(record)
                  setSelectedIndex(index)
                }}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h5>Approved Document</h5>
          {isEditable === '1' ? (
            <Button
              text="Add Document"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={showModal}
            />
          ) : null}
        </div>
        <Table columns={columns} data={tableData} />
        <AddNewDocument
          submit={handleSubmit}
          projDoc={doctype}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
          type={type ?? 'Sales'}
          Value={Value}
        />
      </div>

      <div className="my-3">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h5>Unapproved Document</h5>
        </div>
        <Table columns={UnapprovedColumn} data={unapprovedTabledData} />
      </div>

      <ApproveOrReject
        refId={slaveId}
        refDoctTyp={docTypeCode}
        tenId={tenantId}
        componentToRender={componenttoRender}
        submitFunction={insertfunc}
        saveButtonStatusVal={saveButtonStatus}
        isEditableBtn={isEditableBtn}
      />
    </div>
  )
}

export default EnquiryValidated
