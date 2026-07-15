
import React, { useState, useEffect } from 'react'
import {  message, Modal } from 'antd'
import store from 'store'
// import Manadatorymsg from 'msgfile'
import messageReturn from '_helpers/messageReturn'
import Poimport from '../Poimport'
import Polocal from '../Polocal'
import Poservice from '../Poservice'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../style.scss'
import Poassign from '../Podetail/Poassign'

const ViewPoModal = ({ isModalVisible, HdrId, onCancel }) => {
  console.log(HdrId, 'HdrId in viewpodetails')

  const [potabel, setPoTable] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [pochangetable, setPochangeTable] = useState([])
  const [importview, setImportview] = useState(false)
  const [localview, setLocalview] = useState(false)
  const [serviceview, setServiceview] = useState(false)
  const [rowData, setRowData] = useState({})
  const [selecteddata, setSelectedData] = useState(null)
  const [assigncard, setAssignCard] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [uniqueKey, setUniqueKey] = useState(0)
  const [uniqueKey1, setUniqueKey1] = useState(0)
  const [uniqueKey2, setUniqueKey2] = useState(0)
  const [uniqueKey3, setUniqueKey3] = useState(0)
  const tenantId = store.get('tenantId')
  const ProjectID = store.get('ProjectID')
  const employeeId = store.get('employeeId')
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    handleGetDetails()
  }, [])
  const handleClose = () => {
    setLocalview(false)
    setImportview(false)
    setServiceview(false)
    setAssignCard(false)
    getpotable(selecteddata)
  }
  const callapi = () => {
    getpotable(selecteddata)
  }
  const handleGetDetails = () => {
    setSelectedData()
    getpotable()
    setLocalview(false)
    setImportview(false)
    setAssignCard(false)
    setServiceview(false)
  }

  const getpotable = async () => {
    const IndentDetailsobj = {
      tenantId,
      hdrId: 'getall',
      projectId: ProjectID,
    }
    const response = await indentFileUpload({
      requestPath: 'getPoHdrDtlsByIndentId',
      requestData: IndentDetailsobj,
    })

    if (response) {
      if (response.responseData.length > 0) {
        const updatedData = response.responseData.map((item, index) => {
          let poTypeText = ''
          switch (item.poType) {
            case '1':
              poTypeText = 'Domestic'
              break
            case '2':
              poTypeText = 'Import'
              break
            case '3':
              poTypeText = 'Service'
              break
            default:
              poTypeText = ''
          }
          return {
            ...item,
            sno: index + 1,
            poTypeText,
            praStatus: item.praStatus,
          }
        })

        setPoTable(updatedData)

        // 👉 check if HdrId.poId matches any record
        const matchingRecord = updatedData.find(item => item.poId === HdrId.poId)

        if (matchingRecord) {
          opentableedit(matchingRecord)
        }
      } else {
        message.error(response?.responseMessage)
        setPoTable([])
      }
    }
  }

  const UpdatePOtype = async record => {
    const matchingObject = pochangetable.find(item => item.poId === record?.poId)
    if (record.poType === '0') {
      if (matchingObject) {
        const IndentDetailsobj = {
          poId: matchingObject?.poId,
          empId: employeeId,
          poType: matchingObject?.poType,
        }
        const response = await indentFileUpload({
          requestPath: 'updatePoType',
          requestData: IndentDetailsobj,
        })
        if (response) {
          if (response.responseCode === '200') {
            callapi()
            return matchingObject
          }
        }
      } else {
        messageReturn(673)
        setLocalview(false)
        setImportview(false)
        setAssignCard(false)
      }
    }
    return record
  }

  const opentableedit = async records => {
    const approvedRecords = Array.isArray(records)
      ? records.filter(r => r.isApproved === '1')
      : [records].filter(r => r.isApproved === '1') // normalize single record case

    // eslint-disable-next-line no-restricted-syntax
    for (const rec of approvedRecords) {
      // eslint-disable-next-line no-await-in-loop
      const matchingObject = await UpdatePOtype(rec)
      console.log(matchingObject, 'matching object')

      if (matchingObject && ['1', '2', '3'].includes(matchingObject.poType)) {
        setRowData(matchingObject)

        setLocalview(false)
        setImportview(false)
        setServiceview(false)
        setAssignCard(false)

        if (matchingObject.poType === '1') {
          setLocalview(true)
          setUniqueKey1(prevKey => prevKey + 1)
        }
        if (matchingObject.poType === '2') {
          setImportview(true)
          setUniqueKey2(prevKey => prevKey + 1)
        }
        if (matchingObject.poType === '3') {
          setServiceview(true)
          setUniqueKey3(prevKey => prevKey + 1)
        }
      }
    }
  }



  return (
    <Modal
      title="Purchase Order Detail"
      visible={isModalVisible}
      width="900"
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      bodyStyle={{ overflowX: 'auto' }}
    >
      <div className="my-3">
        <div>
          {importview && potabel.length > 0 ? (
            <Poimport
              key={uniqueKey2}
              rowData={rowData}
              HdrId={HdrId.poId}
              onClose={handleClose}
              calldetailapi={callapi}
              isView
            />
          ) : null}
          {localview && potabel.length > 0 ? (
            <Polocal
              key={uniqueKey1}
              rowData={rowData}
              HdrId={HdrId.poId}
              onClose={handleClose}
              calldetailapi={callapi}
              isView
            />
          ) : null}
          {serviceview && potabel.length > 0 ? (
            <Poservice
              key={uniqueKey3}
              rowData={rowData}
              HdrId={HdrId.poId}
              onClose={handleClose}
              calldetailapi={callapi}
              isView
            />
          ) : null}
          {assigncard && potabel.length > 0 ? (
            <Poassign
              key={uniqueKey}
              rowData={rowData}
              HdrId={HdrId.poId}
              onClose={handleClose}
              calldetailapi={callapi}
              isView
            />
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

export default ViewPoModal
